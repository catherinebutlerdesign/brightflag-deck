import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, LayoutGrid, Maximize, NotebookPen, Presentation, Printer, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { slides, type SlideDef } from "../slides"
import { StageCtx } from "./Live"
import { openPresenter, useDeckChannel } from "./sync"

const W = 1920
const H = 1080

const readHash = () => {
  const n = parseInt(location.hash.replace(/^#\/?/, ""), 10)
  return isFinite(n) ? Math.min(Math.max(n - 1, 0), slides.length - 1) : 0
}

function useViewport() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })
  useEffect(() => {
    const on = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener("resize", on)
    return () => window.removeEventListener("resize", on)
  }, [])
  return size
}

/** Renders a 1920×1080 slide scaled to fit a box. */
export function Scaled({ def, width, height }: { def: SlideDef; width: number; height: number }) {
  const s = Math.min(width / W, height / H)
  return (
    <div style={{ width: W * s, height: H * s }} className="relative overflow-hidden">
      <div style={{ width: W, height: H, transform: `scale(${s})`, transformOrigin: "0 0" }}>
        <def.Component />
      </div>
    </div>
  )
}

export const fmt = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`

export function Deck() {
  const [i, setI] = useState(readHash)
  const [notes, setNotes] = useState(false)
  const [grid, setGrid] = useState(false)
  const [start, setStart] = useState<number | null>(null)
  const [now, setNow] = useState(Date.now())
  const vp = useViewport()
  const def = slides[i]

  const go = useCallback((n: number) => setI(Math.min(Math.max(n, 0), slides.length - 1)), [])
  useEffect(() => {
    history.replaceState(null, "", `#/${i + 1}`)
  }, [i])

  // Keep a presenter view in another window in step: tell it where we are,
  // and follow it when it moves.
  const iRef = useRef(i)
  iRef.current = i
  const post = useDeckChannel(m => {
    if (m.type === "goto") go(m.index)
    if (m.type === "hello") post({ type: "state", index: iRef.current })
  })
  useEffect(() => { post({ type: "state", index: i }) }, [i, post])
  useEffect(() => {
    const on = () => setI(readHash())
    window.addEventListener("hashchange", on)
    return () => window.removeEventListener("hashchange", on)
  }, [])
  useEffect(() => {
    if (start == null) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [start])

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const k = e.key
      if (grid) {
        if (k === "Escape" || k === "g") setGrid(false)
        return
      }
      if (["ArrowRight", "PageDown", " ", "Enter"].includes(k)) { e.preventDefault(); go(i + 1); if (start == null) setStart(Date.now()) }
      else if (["ArrowLeft", "PageUp", "Backspace"].includes(k)) { e.preventDefault(); go(i - 1) }
      else if (k === "Home") go(0)
      else if (k === "End") go(slides.length - 1)
      else if (k === "n") setNotes(v => !v)
      else if (k === "g" || k === "Escape") setGrid(v => !v)
      else if (k === "f") document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()
      else if (k === "t") setStart(s => (s == null ? Date.now() : null))
      else if (k === "p") openPresenter(i)
    }
    window.addEventListener("keydown", on)
    return () => window.removeEventListener("keydown", on)
  }, [i, grid, go, start])

  // Planned time up to the end of the current slide, to pace against.
  const planned = useMemo(() => slides.slice(0, i + 1).reduce((n, s) => n + (s.minutes || 0), 0), [i])
  const total = useMemo(() => slides.reduce((n, s) => n + (s.minutes || 0), 0), [])
  const elapsed = start == null ? 0 : Math.floor((now - start) / 1000)

  const notesH = notes ? Math.min(360, vp.h * 0.42) : 0
  const stageW = vp.w
  const stageH = vp.h - notesH - 4

  return (
    <TooltipProvider delayDuration={300}>
      {/* Presenting view */}
      <div className="no-print flex h-full flex-col">
        <div className="relative flex flex-1 items-center justify-center" onClick={e => { if (e.target === e.currentTarget) go(i + 1) }}>
          <div className="shadow-2xl">
            <StageCtx.Provider value={{ live: true }}>
              <Scaled key={def.id} def={def} width={stageW} height={stageH} />
            </StageCtx.Provider>
          </div>
          <Controls i={i} go={go} notes={notes} setNotes={setNotes} setGrid={setGrid} />
        </div>
        <Progress value={((i + 1) / slides.length) * 100} className="h-1 rounded-none bg-white/10 [&>div]:bg-[#76cad2]" />
        {notes ? (
          <NotesPanel def={def} next={slides[i + 1]} i={i} height={notesH} elapsed={elapsed} running={start != null} planned={planned} total={total} />
        ) : null}
      </div>

      {grid ? <Overview current={i} onPick={n => { go(n); setGrid(false) }} vw={vp.w} /> : null}

      {/* Print / Save as PDF renders every slide on its own page. */}
      <div className="hidden print:block">
        {slides.map(s => (
          <div key={s.id} className="print-slide">
            <s.Component />
          </div>
        ))}
      </div>
    </TooltipProvider>
  )
}

function Controls({ i, go, notes, setNotes, setGrid }: { i: number; go: (n: number) => void; notes: boolean; setNotes: (f: (v: boolean) => boolean) => void; setGrid: (v: boolean) => void }) {
  const tip = (label: string, key: string, icon: React.ReactNode, onClick: () => void, on?: boolean) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" variant="ghost" onClick={onClick} aria-label={label} className={cn("size-9 text-white/70 hover:bg-white/10 hover:text-white", on && "bg-white/15 text-white")}>
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{label} <kbd className="ml-1 rounded bg-white/15 px-1 font-mono">{key}</kbd></TooltipContent>
    </Tooltip>
  )
  return (
    <div className="group absolute bottom-3 right-3 flex items-center gap-1 rounded-xl bg-[#0b1824]/80 p-1 opacity-0 backdrop-blur transition-opacity hover:opacity-100 focus-within:opacity-100">
      {tip("Previous", "←", <ChevronLeft />, () => go(i - 1))}
      <span className="tabular px-2 text-sm text-white/80">{i + 1} / {slides.length}</span>
      {tip("Next", "→", <ChevronRight />, () => go(i + 1))}
      <div className="mx-1 h-5 w-px bg-white/20" />
      {tip("Presenter view in a new window", "P", <Presentation />, () => openPresenter(i))}
      {tip("Speaker notes below the slide", "N", <NotebookPen />, () => setNotes(v => !v), notes)}
      {tip("All slides", "G", <LayoutGrid />, () => setGrid(true))}
      {tip("Full screen", "F", <Maximize />, () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()))}
      {tip("Save as PDF", "⌘P", <Printer />, () => window.print())}
    </div>
  )
}

function NotesPanel({ def, next, i, height, elapsed, running, planned, total }: { def: SlideDef; next?: SlideDef; i: number; height: number; elapsed: number; running: boolean; planned: number; total: number }) {
  const behind = running && elapsed > planned * 60
  return (
    <div className="flex gap-6 border-t border-white/10 bg-[#0e1f2e] px-8 py-5 text-white" style={{ height }}>
      <div className="flex min-w-0 flex-1 flex-col gap-3 overflow-y-auto pr-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-white/20 text-white/80">Slide {i + 1}</Badge>
          <span className="text-sm font-semibold text-[#76cad2]">{def.section}</span>
          {def.minutes ? <span className="text-sm text-white/50">· {def.minutes} min</span> : null}
        </div>
        <ul className="list-disc space-y-2 pl-5 text-[17px] leading-relaxed text-white/90">
          {def.notes.map((n, k) => <li key={k}>{n}</li>)}
          {import.meta.env.VITE_PUBLIC_BUILD ? <li className="list-none text-white/50">Speaker notes aren’t included in the hosted version. Run the deck locally to see them.</li> : null}
        </ul>
      </div>
      <div className="flex w-[300px] shrink-0 flex-col gap-3">
        <div className={cn("flex items-center gap-2 rounded-lg px-3 py-2 text-sm", behind ? "bg-[#bb1425]/30" : "bg-white/5")}>
          <Timer className="size-4" />
          <span className="tabular font-semibold">{fmt(elapsed)}</span>
          <span className="text-white/60">/ plan {planned} of {total} min</span>
          {!running ? <span className="ml-auto text-xs text-white/50">T to start</span> : null}
        </div>
        {next ? (
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider text-white/50">Next</span>
            <div className="overflow-hidden rounded-md ring-1 ring-white/15">
              <Scaled def={next} width={300} height={170} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function Overview({ current, onPick, vw }: { current: number; onPick: (n: number) => void; vw: number }) {
  const cols = vw > 1500 ? 5 : 4
  const tw = (Math.min(vw, 1800) - 64 - (cols - 1) * 20) / cols
  return (
    <div className="no-print fixed inset-0 z-50 overflow-y-auto bg-[#0b1824]/95 p-8 backdrop-blur">
      <div className="mx-auto grid gap-5" style={{ gridTemplateColumns: `repeat(${cols}, ${tw}px)`, width: "fit-content" }}>
        {slides.map((s, n) => (
          <button key={s.id} type="button" onClick={() => onPick(n)} className="group flex flex-col gap-2 text-left">
            <div className={cn("overflow-hidden rounded-md ring-2 transition", n === current ? "ring-[#76cad2]" : "ring-transparent group-hover:ring-white/40")}>
              <Scaled def={s} width={tw} height={(tw * H) / W} />
            </div>
            <span className="text-sm text-white/70"><span className="tabular mr-2 text-white/40">{n + 1}</span>{s.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
