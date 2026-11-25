import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Link2, Link2Off, Pause, Play, RotateCcw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { slides } from "../slides"
import { Scaled, fmt } from "./Deck"
import { useDeckChannel } from "./sync"

const readHash = () => {
  const n = parseInt(location.hash.replace(/^#\/?/, ""), 10)
  return isFinite(n) ? Math.min(Math.max(n - 1, 0), slides.length - 1) : 0
}

function useBox<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [box, setBox] = useState({ w: 0, h: 0 })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, box] as const
}

/** Private presenter window: current and next slide, notes and timer.
 *  Live prototypes only run in the audience window; here they show a still. */
export function Presenter() {
  const [i, setI] = useState(readHash)
  const [linked, setLinked] = useState(false)
  const [start, setStart] = useState<number | null>(null)
  const [paused, setPaused] = useState(0) // seconds banked while paused
  const [now, setNow] = useState(Date.now())
  const [curRef, cur] = useBox<HTMLDivElement>()
  const [nextRef, next] = useBox<HTMLDivElement>()

  const post = useDeckChannel(m => {
    if (m.type === "state") { setI(m.index); setLinked(true) }
  })
  useEffect(() => { post({ type: "hello" }) }, [post])
  useEffect(() => { history.replaceState(null, "", `?presenter#/${i + 1}`) }, [i])
  useEffect(() => { document.title = `Presenter · ${i + 1}/${slides.length}` }, [i])
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const go = useCallback((n: number) => {
    const k = Math.min(Math.max(n, 0), slides.length - 1)
    setI(k)
    post({ type: "goto", index: k })
    setStart(s => (s == null && n > 0 ? Date.now() : s))
  }, [post])

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const k = e.key
      if (["ArrowRight", "PageDown", " ", "Enter"].includes(k)) { e.preventDefault(); go(i + 1) }
      else if (["ArrowLeft", "PageUp", "Backspace"].includes(k)) { e.preventDefault(); go(i - 1) }
      else if (k === "Home") go(0)
      else if (k === "End") go(slides.length - 1)
      else if (k === "t") toggleTimer()
    }
    window.addEventListener("keydown", on)
    return () => window.removeEventListener("keydown", on)
  })

  const running = start != null
  const elapsed = running ? paused + Math.floor((now - start!) / 1000) : paused
  const toggleTimer = () => {
    if (running) { setPaused(elapsed); setStart(null) } else setStart(Date.now())
  }
  const resetTimer = () => { setStart(null); setPaused(0) }

  const def = slides[i]
  const nextDef = slides[i + 1]
  const planned = useMemo(() => slides.slice(0, i + 1).reduce((n, s) => n + (s.minutes || 0), 0), [i])
  const total = useMemo(() => slides.reduce((n, s) => n + (s.minutes || 0), 0), [])
  const behind = elapsed > planned * 60 && elapsed > 0

  return (
    <div className="flex h-full flex-col gap-4 bg-[#0b1824] p-5 text-white">
      {/* Top bar */}
      <div className="flex items-center gap-4">
        <span className="tabular text-2xl font-semibold">{i + 1}<span className="text-white/40"> / {slides.length}</span></span>
        <span className="truncate text-lg font-semibold text-[#76cad2]">{def.section}</span>
        {def.minutes ? <span className="text-white/50">{def.minutes} min</span> : null}
        {def.live ? <Badge className="rounded-full bg-[#087c90]">LIVE · click the steps in the audience window</Badge> : null}
        <div className="ml-auto flex items-center gap-2">
          <span className={cn("flex items-center gap-1.5 text-sm", linked ? "text-[#76cad2]" : "text-amber-300")}>
            {linked ? <Link2 className="size-4" /> : <Link2Off className="size-4" />}
            {linked ? "In sync with the deck" : "Deck window not found: keep it open"}
          </span>
          <Separator orientation="vertical" className="mx-2 h-6 bg-white/15" />
          <Button size="icon" variant="ghost" onClick={() => go(i - 1)} aria-label="Previous slide" className="text-white hover:bg-white/10 hover:text-white"><ChevronLeft /></Button>
          <Button onClick={() => go(i + 1)} className="bg-[#76cad2] text-[#10253a] hover:bg-[#76cad2]/90">Next <ChevronRight /></Button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-5" style={{ gridTemplateColumns: "minmax(0, 3fr) minmax(0, 2fr)" }}>
        {/* Current slide + notes */}
        <div className="flex min-h-0 flex-col gap-4">
          <div ref={curRef} className="flex h-[55%] items-start justify-center">
            {cur.w ? <div className="overflow-hidden rounded-lg ring-2 ring-[#76cad2]"><Scaled def={def} width={cur.w} height={cur.h} /></div> : null}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto rounded-xl bg-[#0e1f2e] px-7 py-5">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-white/40">Speaker notes</div>
            {def.notes.length ? (
              <ul className="list-disc space-y-3 pl-6 text-[22px] leading-relaxed text-white/90">
                {def.notes.map((n, k) => <li key={k}>{n}</li>)}
              </ul>
            ) : (
              <p className="text-lg text-white/50">
                {import.meta.env.VITE_PUBLIC_BUILD ? "Speaker notes aren’t included in the hosted version. Run the deck locally to see them." : "No notes for this slide."}
              </p>
            )}
          </div>
        </div>

        {/* Timer + next slide */}
        <div className="flex min-h-0 flex-col gap-4">
          <div className={cn("flex items-center gap-4 rounded-xl px-6 py-4", behind ? "bg-[#bb1425]/30" : "bg-[#0e1f2e]")}>
            <span className="tabular text-5xl font-bold">{fmt(elapsed)}</span>
            <div className="flex flex-col text-sm text-white/60">
              <span>Plan: {planned} of {total} min by the end of this slide</span>
              <span>{behind ? "Running over: consider skipping LIVE slides" : running ? "On pace" : "Starts on your first Next, or press T"}</span>
            </div>
            <div className="ml-auto flex gap-1">
              <Button size="icon" variant="ghost" onClick={toggleTimer} aria-label={running ? "Pause timer" : "Start timer"} className="text-white hover:bg-white/10 hover:text-white">{running ? <Pause /> : <Play />}</Button>
              <Button size="icon" variant="ghost" onClick={resetTimer} aria-label="Reset timer" className="text-white hover:bg-white/10 hover:text-white"><RotateCcw /></Button>
            </div>
          </div>
          <Progress value={((i + 1) / slides.length) * 100} className="h-1.5 bg-white/10 [&>div]:bg-[#76cad2]" />
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-white/40">Next{nextDef ? ` · ${nextDef.section}` : ""}</div>
          <div ref={nextRef} className="flex min-h-0 flex-1 items-start justify-center">
            {nextDef && next.w ? (
              <button type="button" onClick={() => go(i + 1)} className="overflow-hidden rounded-lg opacity-90 ring-1 ring-white/15 transition hover:opacity-100">
                <Scaled def={nextDef} width={next.w} height={next.h} />
              </button>
            ) : !nextDef ? <span className="text-white/50">End of deck</span> : null}
          </div>
        </div>
      </div>
    </div>
  )
}
