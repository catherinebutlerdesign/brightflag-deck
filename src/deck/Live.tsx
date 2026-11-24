import { createContext, useCallback, useContext, useRef, useState } from "react"
import { Check, Loader2, MousePointerClick, RotateCcw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/* Live embeds only run on the main stage. Thumbnails (overview, next-slide
   preview) and print show the poster screenshot instead. */
export const StageCtx = createContext<{ live: boolean }>({ live: false })

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

/** Drives the embedded prototype through its real UI: same-origin DOM clicks and typing. */
export class Driver {
  constructor(private frame: HTMLIFrameElement) {}
  get win() { return this.frame.contentWindow as Window & typeof globalThis }
  get doc() { return this.frame.contentDocument as Document }
  pause = (ms = 450) => sleep(ms)

  async until<T>(fn: () => T | null | undefined | false, what: string, timeout = 8000): Promise<T> {
    const t0 = Date.now()
    for (;;) {
      const v = fn()
      if (v) return v
      if (Date.now() - t0 > timeout) throw new Error(`Couldn't find ${what}`)
      await sleep(80)
    }
  }
  /** First element matching `sel` whose text (or aria-label) contains `text`. */
  find(sel: string, text?: string | RegExp) {
    const els = Array.from(this.doc.querySelectorAll<HTMLElement>(sel))
    if (text == null) return els[0] || null
    return els.find(e => {
      const t = `${e.textContent || ""} ${e.getAttribute("aria-label") || ""}`.trim()
      return typeof text === "string" ? t.includes(text) : text.test(t)
    }) || null
  }
  private flash(el: HTMLElement) {
    const r = el.getBoundingClientRect()
    const d = this.doc.createElement("div")
    Object.assign(d.style, {
      position: "fixed", left: `${r.left - 6}px`, top: `${r.top - 6}px`, width: `${r.width + 12}px`, height: `${r.height + 12}px`,
      border: "3px solid #087c90", borderRadius: "10px", boxShadow: "0 0 0 6px rgba(118,202,210,.35)",
      pointerEvents: "none", zIndex: "99999", transition: "opacity .5s", opacity: "1",
    })
    this.doc.body.appendChild(d)
    setTimeout(() => { d.style.opacity = "0"; setTimeout(() => d.remove(), 500) }, 650)
  }
  async click(sel: string, text?: string | RegExp, what = text ? String(text) : sel) {
    const el = await this.until(() => this.find(sel, text), what)
    el.scrollIntoView({ block: "nearest" })
    this.flash(el)
    await sleep(380)
    el.click()
    await this.pause()
  }
  async type(sel: string, value: string, what = sel) {
    const el = await this.until(() => this.doc.querySelector<HTMLInputElement>(sel), what)
    this.flash(el)
    el.focus()
    const setter = Object.getOwnPropertyDescriptor(this.win.HTMLInputElement.prototype, "value")!.set!
    setter.call(el, "")
    el.dispatchEvent(new this.win.Event("input", { bubbles: true }))
    for (const ch of value) {
      setter.call(el, el.value + ch)
      el.dispatchEvent(new this.win.Event("input", { bubbles: true }))
      await sleep(70)
    }
    await this.pause()
  }
  /** Scroll an element into view and highlight it, without clicking. */
  async reveal(sel: string, what = sel) {
    const el = await this.until(() => this.doc.querySelector<HTMLElement>(sel), what)
    el.scrollIntoView({ block: "center", behavior: "smooth" })
    await sleep(400)
    this.flash(el)
    await this.pause(700)
  }
  /** Find a subscription from the header search and open it, then clear the search. */
  async openSub(id: string) {
    await this.type("input[role=searchbox]", id, "the search field")
    await this.click("tbody button.link", undefined, `subscription ${id}`)
    const clear = this.find("button[aria-label='Clear search']")
    if (clear) clear.click()
    await this.pause(300)
  }
  tab = (name: string) => this.click("[role=tab]", new RegExp(`^${name}$`), `the ${name} tab`)
  actor = (label: "Client" | "Vendor" | "Operations") => this.click(".proto .seg button", new RegExp(`^${label}$`), `View as ${label}`)
}

/* Slide keys pressed while the prototype has focus are passed up to the deck,
   except while typing in one of its fields. */
const DECK_KEYS = ["PageDown", "PageUp", "ArrowRight", "ArrowLeft"]
function forwardKeys(f: HTMLIFrameElement) {
  const w = f.contentWindow
  if (!w) return
  w.addEventListener("keydown", e => {
    // Clicker keys always move slides; arrows only when nothing in the prototype has focus,
    // so its menus, tabs and fields keep their own arrow-key behaviour.
    const t = e.target as HTMLElement | null
    const idle = !t || t === w.document.body || t === w.document.documentElement
    if (!DECK_KEYS.includes(e.key) || (e.key.startsWith("Arrow") && !idle)) return
    e.preventDefault()
    window.dispatchEvent(new KeyboardEvent("keydown", { key: e.key }))
  })
}

export type Step = { label: string; run: (d: Driver) => Promise<void> }

export function LivePrototype({
  file = "subscriptions-prototype.html",
  actor = "client",
  steps = [],
  poster,
  width,
  height,
  hint = "Click inside to explore freely",
}: {
  file?: string
  actor?: "client" | "vendor" | "ops"
  steps?: Step[]
  poster: string
  width: number
  height: number
  hint?: string
}) {
  const { live } = useContext(StageCtx)
  const frame = useRef<HTMLIFrameElement>(null)
  const [nonce, setNonce] = useState(0)
  const loaded = useRef(-1)
  const [done, setDone] = useState(-1)
  const [busy, setBusy] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const waitReady = useCallback(async (n: number) => {
    const t0 = Date.now()
    for (;;) {
      const f = frame.current
      const ok = f && loaded.current === n && f.contentDocument?.querySelector(file.includes("mobile") ? "#root *" : ".hdr")
      if (ok) return f!
      if (Date.now() - t0 > 20000) throw new Error("The prototype didn’t load. It needs an internet connection for React and its icon font.")
      await sleep(100)
    }
  }, [file])

  const reload = useCallback(async () => {
    const n = nonce + 1
    setNonce(n)
    setDone(-1)
    await sleep(50)
    return waitReady(n)
  }, [nonce, waitReady])

  const runTo = async (i: number) => {
    if (busy != null) return
    setError(null)
    try {
      let f = frame.current!
      let start = done + 1
      if (i <= done) { f = await reload(); start = 0 } else { f = await waitReady(nonce) }
      const d = new Driver(f)
      for (let k = start; k <= i; k++) {
        setBusy(k)
        await steps[k].run(d)
        setDone(k)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(null)
    }
  }

  if (!live) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-white ring-1 ring-navy/10" style={{ width, height }}>
        <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover object-left-top" />
        <Badge className="absolute right-4 top-4 rounded-full bg-teal px-3 text-[16px]">Live prototype</Badge>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4" style={{ width }}>
      {steps.length ? (
        <div className="flex items-center gap-2.5">
          {steps.map((s, i) => (
            <Button
              key={s.label}
              variant={i <= done ? "default" : "outline"}
              onClick={() => runTo(i)}
              disabled={busy != null}
              className={cn("h-11 gap-2 rounded-full px-4 text-[17px]", i <= done && "bg-teal hover:bg-teal/90", busy === i && "opacity-100")}
            >
              <span className={cn("flex size-6 items-center justify-center rounded-full text-[13px] font-bold", i <= done ? "bg-white/25" : "bg-secondary text-secondary-foreground")}>
                {busy === i ? <Loader2 className="size-4 animate-spin" /> : i <= done ? <Check className="size-4" /> : i + 1}
              </span>
              {s.label}
            </Button>
          ))}
          <Button variant="ghost" onClick={() => !busy && reload()} className="ml-auto h-11 gap-2 rounded-full text-[17px] text-muted-foreground">
            <RotateCcw className="size-4" /> Restart
          </Button>
        </div>
      ) : null}
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-[0_30px_60px_-20px_rgba(16,37,58,0.35)] ring-1 ring-navy/10" style={{ height }}>
        <iframe
          key={nonce}
          ref={frame}
          data-n={nonce}
          title="Subscriptions prototype"
          src={`./prototype/${file}#${actor}`}
          onLoad={e => { loaded.current = nonce; forwardKeys(e.currentTarget) }}
          className="absolute inset-0 h-full w-full border-0"
        />
        {error ? (
          <div className="absolute inset-x-6 bottom-6 rounded-xl bg-destructive px-5 py-3 text-[17px] text-white shadow-lg">{error}</div>
        ) : null}
      </div>
      <div className="flex items-center gap-2 text-[16px] text-muted-foreground">
        <MousePointerClick className="size-4" /> {hint}. A clicker still moves slides; arrow keys do once nothing in the frame is focused.
      </div>
    </div>
  )
}
