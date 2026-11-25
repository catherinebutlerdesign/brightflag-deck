import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react"
import { AlertTriangle, ArrowLeft, ArrowRight, BookOpen, Eye, EyeOff, Lock, MonitorPlay, Quote } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Highlight, Marker, Shot, Status, screen } from "../deck/kit"
import { LivePrototype, StageCtx, type Step } from "../deck/Live"
import { FLOWS } from "../deck/flows"

/* Private interview revision page. Only reachable in a local build (?prep, or R in
   the deck): main.tsx compiles it out of the hosted build, like the speaker notes. */

const SECTIONS = [
  { id: "structure", label: "Structure & state" },
  { id: "transactions", label: "Transactions & billing" },
  { id: "revision", label: "Revision sheet" },
  { id: "sources", label: "Sources" },
]

export default function Prep() {
  useEffect(() => {
    const b = document.body.style
    const prev = { overflow: b.overflow, background: b.background }
    b.overflow = "auto"
    b.background = "#f1f6f9"
    document.title = "Interview revision · private"
    return () => { b.overflow = prev.overflow; b.background = prev.background }
  }, [])

  return (
    <div className="min-h-full bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1280px] items-center gap-6 px-8 py-3">
          <a href={location.pathname} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-navy">
            <ArrowLeft className="size-4" /> Deck
          </a>
          <nav className="flex gap-1">
            {SECTIONS.map(s => (
              <a key={s.id} href={`#${s.id}`} onClick={e => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" }) }}
                className="rounded-full px-3 py-1.5 text-sm font-medium text-ink hover:bg-secondary">
                {s.label}
              </a>
            ))}
          </nav>
          <Badge variant="outline" className="ml-auto gap-1.5 rounded-full border-amber-300 bg-amber-50 px-3 py-1 text-amber-800">
            <Lock className="size-3.5" /> Private · local only, never in the hosted deck
          </Badge>
        </div>
      </header>

      <main className="mx-auto flex max-w-[1280px] flex-col gap-24 px-8 pb-32 pt-14">
        <div className="flex flex-col gap-3">
          <div className="text-sm font-bold uppercase tracking-[0.1em] text-teal">Brightflag · Interview revision · Researched edition</div>
          <h1 className="text-5xl font-bold tracking-[-0.02em] text-navy">SoftwareOne Marketplace: design decisions</h1>
          <p className="max-w-3xl text-xl text-muted-foreground">
            Four decisions, each with its evidence, the documented rules behind it, what you decided and what it cost. Open the prototype under each one to click through it.
          </p>
        </div>

        {/* ------------------------------------------------ Structure & state */}
        <Section id="structure" title="Structure & state" lead="Two examples of designing interconnected commercial objects.">
          <Topic n="01" title="Subscription object page" tag="Your strongest research example"
            rows={[
              ["Research", "Heap indicated poor legacy conversion. Interviews exposed difficulty locating split billing."],
              ["Docs [1–2]", "An agreement can have multiple subscriptions. Entitlements link purchased items to an agreement and order; they may belong to a subscription."],
              ["Decision", "I mapped related objects and created a shared template: highlights, tabs, global and contextual actions. PMs prioritised commercial fields; I designed the hierarchy."],
              ["Trade-off", "Less bespoke flexibility, more consistency and faster working (qualitative). Leadership and Customer Success reviewed designs."],
            ]}
            remember="Analytics identified a problem; interviews helped explain discoverability. Object modelling gave me a way to respond."
            graphic={<div className="flex flex-col gap-6"><ObjectModel /><TemplateAnatomy /></div>}
            live={{ actor: "client", steps: FLOWS.objectPage, poster: screen("04-split-tab-client"), label: "Tour the object page template" }}
          />

          <Topic n="02" title="Lifecycle and status" tag="Your systems thinking example"
            rows={[
              ["Evidence", "Journey mapping and PM discussions revealed dependencies between orders, agreements and subscriptions."],
              ["Docs [3–4]", "Draft = vendor created subscription, order incomplete; Updating = change in progress; Terminating = termination order created. Agreement status can also reflect a subscription transaction."],
              ["Decision", "Represent intermediate states, feedback and permitted actions. More conditional logic, but clearer expectations and intended error prevention."],
            ]}
            remember="I was designing a changing business object, not a static record."
            check="The state diagram lists Draft, Active, Updating, Terminating, Terminated and Deleted. An API endpoint also lists Expired [3]. Confirm which applied to your original UI. Validation and exact locks are not confirmed."
            graphic={<StateMap />}
            live={{ actor: "client", steps: FLOWS.lifecycle, poster: screen("01c-list-needs-attention-client"), label: "Needs attention, then a Terminating subscription" }}
          />
        </Section>

        {/* ------------------------------------------------ Transactions & billing */}
        <Section id="transactions" title="Transactions & billing" lead="Explain the real business rules behind each interaction.">
          <Topic n="03" title="Change subscription" tag="Your strongest scope example"
            rows={[
              ["Evidence", "Customers needed additional licences; order processing is a commercial transaction."],
              ["Docs [5]", "Quantity changes create change orders. Purchase, change and termination orders serve distinct purposes."],
              ["Decision", "I replaced the simple edit modal with an existing ordering pattern, including review and summary. I introduced the delta column."],
              ["Trade-off", "An additional step, but a chance to review the commercial consequences. Business experts reviewed the workflow."],
            ]}
            remember="It was not simply an edit. It was a transaction."
            graphic={<ChangeGraphic />}
            live={{ actor: "client", steps: FLOWS.change, poster: screen("32-change-items-increase"), label: "Change order: rule at the input, delta at review" }}
          />

          <Topic n="04" title="Split billing" tag="Financial comprehension"
            rows={[
              ["Docs [6]", "Adobe VIP split billing is enabled at agreement level; default Owner gets 100%. ELC is indicative: invoices use percentages. Changes take effect next billing cycle; allocated buyers cannot be removed."],
              ["Decision", "Put billing in subscription context; offer percentage or estimated licence count, live financial values and 100% validation."],
              ["Trade-off", "More detail than a simple form, but clearer financial responsibility and valid allocations."],
            ]}
            remember="Users may think in seats; billing operates on percentages. Bridge the two mental models."
            check="Confirm why ELC was introduced and the original validation feedback. No measured increase in revenue or reduction in billing errors has been established."
            graphic={<SeatsBridge />}
            live={{ actor: "client", steps: FLOWS.split, poster: screen("11-split-modal-error-client"), label: "Edit split billing: 35% → 110% → the rule" }}
          />
        </Section>

        {/* ------------------------------------------------ Revision sheet */}
        <RevisionSheet />

        {/* ------------------------------------------------ Sources */}
        <Sources />
      </main>
    </div>
  )
}

/* ================================================================ layout */

function Section({ id, title, lead, children }: { id: string; title: string; lead: string; children: ReactNode }) {
  return (
    <section id={id} className="flex scroll-mt-20 flex-col gap-10">
      <div className="flex flex-col gap-2 border-b pb-5">
        <div className="text-sm font-bold uppercase tracking-[0.1em] text-teal">SoftwareOne Marketplace · Design decisions</div>
        <h2 className="text-4xl font-bold tracking-[-0.02em] text-navy">{title}</h2>
        <p className="text-lg text-muted-foreground">{lead}</p>
      </div>
      {children}
    </section>
  )
}

const ROW_TONE: Record<string, string> = {
  Research: "bg-teal text-white",
  Evidence: "bg-teal text-white",
  Decision: "bg-navy text-white",
  "Trade-off": "bg-[#ddeef2] text-[#174a5a]",
}

function Topic({ n, title, tag, rows, remember, check, graphic, live }: {
  n: string; title: string; tag: string
  rows: [string, string][]
  remember: string
  check?: string
  graphic: ReactNode
  live: { actor: "client" | "vendor" | "ops"; steps: Step[]; poster: string; label: string }
}) {
  return (
    <Card className="overflow-hidden rounded-3xl border-0 shadow-sm">
      <CardContent className="flex flex-col gap-8 p-10">
        <div className="flex items-baseline gap-4">
          <span className="text-5xl font-bold text-teal-light tabular">{n}</span>
          <div className="flex flex-col">
            <h3 className="text-3xl font-bold text-navy">{title}</h3>
            <span className="text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground">{tag}</span>
          </div>
        </div>

        <div className="grid gap-10" style={{ gridTemplateColumns: "minmax(0, 1fr) 560px" }}>
          <div className="flex flex-col gap-5">
            {rows.map(([label, text]) => (
              <div key={label} className="grid grid-cols-[112px_1fr] items-start gap-4">
                <span className={cn("mt-0.5 rounded-md px-2 py-1 text-center text-[11px] font-bold uppercase tracking-[0.08em]", ROW_TONE[label] || "bg-muted text-muted-foreground")}>{label}</span>
                <p className="text-[17px] leading-relaxed text-ink">{text}</p>
              </div>
            ))}
            <div className="mt-2 flex gap-3 rounded-xl bg-navy px-5 py-4 text-white">
              <Quote className="mt-0.5 size-5 shrink-0 text-teal-light" />
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-teal-light">Remember</div>
                <p className="text-[17px] leading-relaxed">{remember}</p>
              </div>
            </div>
            {check ? <Callout tone="check" title="Check">{check}</Callout> : null}
          </div>
          <div>{graphic}</div>
        </div>

        <LiveEmbed {...live} />
      </CardContent>
    </Card>
  )
}

function Callout({ tone, title, children }: { tone: "check" | "warn" | "info"; title: string; children: ReactNode }) {
  const t = {
    check: "border-amber-300 bg-amber-50 text-amber-900",
    warn: "border-red-300 bg-red-50 text-red-900",
    info: "border-[#76cad2] bg-[#ddeef2]/60 text-[#174a5a]",
  }[tone]
  return (
    <div className={cn("flex gap-3 rounded-xl border px-5 py-4", t)}>
      {tone === "info" ? <BookOpen className="mt-0.5 size-5 shrink-0" /> : <AlertTriangle className="mt-0.5 size-5 shrink-0" />}
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.1em] opacity-80">{title}</div>
        <p className="text-[15px] leading-relaxed">{children}</p>
      </div>
    </div>
  )
}

/** The real prototype, loaded on demand so the page stays light. */
function LiveEmbed({ actor, steps, poster, label }: { actor: "client" | "vendor" | "ops"; steps: Step[]; poster: string; label: string }) {
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(0)
  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div ref={box} className="flex flex-col gap-3 border-t pt-6">
      <div className="flex items-center gap-3">
        <Badge className="rounded-full bg-teal px-3">LIVE</Badge>
        <span className="font-semibold text-navy">{label}</span>
        <Button variant={open ? "ghost" : "default"} onClick={() => setOpen(v => !v)} className={cn("ml-auto gap-2 rounded-full", !open && "bg-navy")}>
          <MonitorPlay className="size-4" /> {open ? "Close prototype" : "Open prototype"}
        </Button>
      </div>
      {open && w ? (
        <StageCtx.Provider value={{ live: true }}>
          <LivePrototype actor={actor} steps={steps} poster={poster} width={w} height={720} hint="The real prototype. Run the steps or click around" inDeck={false} />
        </StageCtx.Provider>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="group relative h-[180px] overflow-hidden rounded-2xl ring-1 ring-navy/10">
          <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover object-left-top opacity-80 transition group-hover:opacity-100" />
          <span className="absolute inset-0 flex items-center justify-center bg-navy/30 text-lg font-semibold text-white opacity-0 transition group-hover:opacity-100">Open the live prototype</span>
        </button>
      )}
    </div>
  )
}

/* ================================================================ graphics */

const MW = 560
const NH = 58
type MNode = { id: string; x: number; y: number; w: number; title: string; sub?: string; main?: boolean; stack?: boolean }
const MODEL: MNode[] = [
  { id: "agr", x: 190, y: 0, w: 180, title: "Agreement" },
  { id: "sub", x: 190, y: 150, w: 180, title: "Subscription", sub: "one of many", main: true, stack: true },
  { id: "ord", x: 0, y: 150, w: 130, title: "Order" },
  { id: "ent", x: 430, y: 150, w: 130, title: "Entitlements" },
  { id: "buy", x: 40, y: 300, w: 200, title: "Buyers", sub: "and split billing" },
  { id: "prc", x: 320, y: 300, w: 200, title: "Pricing" },
]
const c = (id: string) => { const n = MODEL.find(m => m.id === id)!; return { x: n.x + n.w / 2, y: n.y + NH / 2, n } }
const EDGES: { a: string; b: string; label: string; dashed?: boolean; lx: number; ly: number }[] = [
  { a: "agr", b: "sub", label: "has many", lx: 286, ly: 94 },
  { a: "ord", b: "sub", label: "creates · changes", lx: 112, ly: 128 },
  { a: "ent", b: "sub", label: "may belong to", dashed: true, lx: 370, ly: 128 },
  { a: "ent", b: "agr", label: "linked to agreement and order", lx: 392, ly: 70 },
  { a: "buy", b: "sub", label: "billed to", lx: 150, ly: 250 },
  { a: "prc", b: "ent", label: "prices", lx: 452, ly: 250 },
]

function ObjectModel() {
  return (
    <figure className="flex flex-col gap-3">
      <div className="relative" style={{ width: MW, height: 360 }}>
        <svg className="absolute inset-0 overflow-visible" width={MW} height={360}>
          {EDGES.map(e => {
            const p = c(e.a), q = c(e.b)
            return <line key={e.a + e.b} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#76cad2" strokeWidth={2.5} strokeDasharray={e.dashed ? "7 6" : undefined} />
          })}
        </svg>
        {EDGES.map(e => (
          <span key={e.label} className="absolute -translate-x-1/2 whitespace-nowrap rounded bg-white px-1.5 text-[12px] font-medium text-teal" style={{ left: e.lx, top: e.ly }}>{e.label}</span>
        ))}
        {MODEL.map(n => (
          <div key={n.id} className="absolute" style={{ left: n.x, top: n.y, width: n.w, height: NH }}>
            {n.stack ? <>
              <div className="absolute inset-0 translate-x-2 -translate-y-2 rounded-xl bg-navy/25" />
              <div className="absolute inset-0 translate-x-1 -translate-y-1 rounded-xl bg-navy/50" />
            </> : null}
            <div className={cn("absolute inset-0 flex flex-col items-center justify-center rounded-xl border text-center", n.main ? "border-navy bg-navy text-white" : "bg-white")}>
              <span className="text-[16px] font-semibold">{n.title}</span>
              {n.sub ? <span className={cn("text-[11px]", n.main ? "text-white/70" : "text-muted-foreground")}>{n.sub}</span> : null}
            </div>
          </div>
        ))}
      </div>
      <figcaption className="text-sm text-muted-foreground">Object map: relationships from the docs [1–2]. Related information and actions belong in the subscription’s context.</figcaption>
    </figure>
  )
}

function TemplateAnatomy() {
  return (
    <figure className="flex flex-col gap-3">
      <Shot src={screen("04-split-tab-client")} crop={{ x: 0, y: 80, w: 1920, h: 300 }} width={MW} alt="Subscription object page template">
        <Highlight box={{ x: 24, y: 164, w: 1872, h: 112 }} pad={2} />
        <Marker n={1} x={30} y={220} />
        <Marker n={2} x={30} y={330} />
        <Marker n={3} x={1760} y={110} />
        <Marker n={4} x={1800} y={330} />
      </Shot>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[14px] text-ink">
        <span><b className="text-teal">1</b> Highlights: PMs chose the fields, you the hierarchy</span>
        <span><b className="text-teal">2</b> Tabs: related objects, same context</span>
        <span><b className="text-teal">3</b> Global Edit: whole-subscription changes</span>
        <span><b className="text-teal">4</b> Contextual Edit: inside the split billing tab</span>
      </div>
    </figure>
  )
}

const STATE_GROUPS: { group: string; states: { s: string; def: string; proto: boolean; docs: string }[] }[] = [
  { group: "Before live", states: [
    { s: "Draft", def: "Vendor created the subscription; order incomplete", proto: false, docs: "State diagram" },
    { s: "Deleted", def: "Listed in the state diagram", proto: false, docs: "State diagram" },
  ] },
  { group: "Live", states: [
    { s: "Active", def: "Running normally; all actions available", proto: true, docs: "State diagram" },
  ] },
  { group: "In transition", states: [
    { s: "Updating", def: "Change in progress", proto: true, docs: "State diagram" },
    { s: "Terminating", def: "Termination order created", proto: true, docs: "State diagram" },
  ] },
  { group: "Ended", states: [
    { s: "Terminated", def: "Ended; read-only", proto: true, docs: "State diagram" },
    { s: "Expired", def: "Listed by an API endpoint only", proto: true, docs: "API only" },
  ] },
]
const CHIP: Record<string, string> = {
  Draft: "bg-[#f4f6f8] text-[#434952]", Deleted: "bg-[#f4f6f8] text-[#434952]",
}

function StateMap() {
  return (
    <figure className="flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-2">
        {STATE_GROUPS.map(g => (
          <div key={g.group} className="flex flex-col gap-2">
            <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">{g.group}</div>
            {g.states.map(st => (
              <div key={st.s} className={cn("flex flex-col gap-1.5 rounded-xl border bg-white p-3", !st.proto && "border-dashed")}>
                {CHIP[st.s] ? <Badge variant="outline" className={cn("self-start rounded-md border-transparent px-2 text-[13px] font-medium", CHIP[st.s])}>{st.s}</Badge> : <Status className="self-start px-2 py-0.5 text-[13px]">{st.s}</Status>}
                <span className="text-[12px] leading-snug text-ink">{st.def}</span>
                <span className={cn("text-[10px] font-semibold uppercase tracking-wide", st.proto ? "text-teal" : "text-amber-700")}>{st.proto ? "In your prototype" : "Docs only · confirm"}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-secondary/60 p-4 text-[14px] leading-relaxed text-ink">
        <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.08em] text-teal">Transitions you can demo</div>
        <div className="flex flex-wrap items-center gap-1.5">
          <Status className="px-2 py-0 text-[12px]">Active</Status><ArrowRight className="size-3.5" /><Status className="px-2 py-0 text-[12px]">Updating</Status><ArrowRight className="size-3.5" /><Status className="px-2 py-0 text-[12px]">Active</Status>
          <span className="mx-2 text-muted-foreground">·</span>
          <Status className="px-2 py-0 text-[12px]">Active</Status><ArrowRight className="size-3.5" /><Status className="px-2 py-0 text-[12px]">Terminating</Status><ArrowRight className="size-3.5" /><Status className="px-2 py-0 text-[12px]">Terminated</Status>
        </div>
        <p className="mt-2 text-[13px] text-muted-foreground">Agreement status can change with a subscription transaction too: in the prototype, the agreement shows Updating while a change order is in flight.</p>
      </div>
      <figcaption className="text-sm text-muted-foreground">States from the docs [3–4]. Dashed = not in your prototype; confirm what your original UI used.</figcaption>
    </figure>
  )
}

function ChangeGraphic() {
  return (
    <figure className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-3">
        {[["20", "Current licences", "text-navy"], ["24", "New quantity", "text-navy"], ["+4", "Change / delta", "text-[#00784d]"]].map(([v, l, t]) => (
          <div key={l} className="flex flex-col items-center gap-1 rounded-2xl bg-white p-5 ring-1 ring-border">
            <span className={cn("text-5xl font-bold tabular", t)}>{v}</span>
            <span className="text-[13px] text-muted-foreground">{l}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">From an edit to a transaction</div>
        <div className="flex flex-wrap items-center gap-2 text-[14px]">
          <span className="rounded-lg border border-dashed px-3 py-1.5 text-muted-foreground line-through">Simple edit modal</span>
          <ArrowRight className="size-4 text-teal" />
          {["Items", "Split billing*", "Details", "Review", "Summary"].map((s, i) => (
            <span key={s} className="flex items-center gap-2">
              {i ? <span className="h-px w-3 bg-teal-light" /> : null}
              <span className={cn("rounded-lg px-3 py-1.5 font-medium", s === "Review" ? "bg-navy text-white" : "bg-secondary text-secondary-foreground")}>{s}</span>
            </span>
          ))}
        </div>
        <span className="text-[12px] text-muted-foreground">* Only on split subscriptions. Review shows the delta, not the whole bill.</span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">Three order types, three purposes [5]</div>
        <div className="grid grid-cols-3 gap-2 text-[13px]">
          {[["Purchase", "Creates the subscription"], ["Change", "Changes quantities on a live one"], ["Termination", "Ends the subscription"]].map(([t, d]) => (
            <div key={t} className={cn("rounded-xl border bg-white p-3", t === "Change" && "border-teal ring-1 ring-teal")}>
              <div className="font-semibold text-navy">{t}</div>
              <div className="text-muted-foreground">{d}</div>
            </div>
          ))}
        </div>
      </div>
      <figcaption className="text-sm text-muted-foreground">Sheet example 20 → 24. The prototype’s sample data uses 6 → 10, the same +4.</figcaption>
    </figure>
  )
}

const BUYERS = [
  { name: "Stark Industries", owner: true, pct: 60, elc: 7, tone: "#10253a" },
  { name: "Stark Industries II", pct: 25, elc: 3, tone: "#087c90" },
  { name: "Stark Industries III", pct: 15, elc: 2, tone: "#76cad2" },
]
function SeatsBridge() {
  const total = BUYERS.reduce((n, b) => n + b.elc, 0)
  return (
    <figure className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground"><span>How people think · seats (ELC, indicative)</span><span>{total} licences</span></div>
        <div className="flex h-11 overflow-hidden rounded-lg">
          {BUYERS.map(b => <div key={b.name} className="flex items-center justify-center text-[15px] font-bold text-white" style={{ width: `${(b.elc / total) * 100}%`, background: b.tone }}>{b.elc}</div>)}
        </div>
        <div className="flex">
          {BUYERS.map(b => <div key={b.name} className="flex justify-center" style={{ width: `${b.pct}%` }}><span className="h-6 w-0.5 bg-[#b8c7d1]" /></div>)}
        </div>
        <div className="flex h-11 overflow-hidden rounded-lg ring-2 ring-navy">
          {BUYERS.map(b => <div key={b.name} className="flex items-center justify-center text-[15px] font-bold text-white" style={{ width: `${b.pct}%`, background: b.tone }}>{b.pct}%</div>)}
        </div>
        <div className="flex justify-between text-[12px] font-semibold uppercase tracking-[0.08em] text-navy"><span>How invoices work · allocation %</span><span>must total 100%</span></div>
        <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-ink">
          {BUYERS.map(b => <span key={b.name} className="flex items-center gap-1.5"><span className="size-3 rounded-sm" style={{ background: b.tone }} />{b.name}{b.owner ? <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">Owner</Badge> : null}</span>)}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">Rules from the docs [6]</div>
        <div className="flex flex-wrap gap-2 text-[13px]">
          {["Enabled per agreement (Adobe VIP)", "Owner defaults to 100%", "ELC is indicative; invoices use %", "Takes effect next billing cycle", "Allocated buyers can’t be removed"].map(r => (
            <span key={r} className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground">{r}</span>
          ))}
        </div>
      </div>
      <figcaption className="text-sm text-muted-foreground">Prototype sample: 60/25/15% of 12 licences. Seats round; billing doesn’t.</figcaption>
    </figure>
  )
}

/* ================================================================ revision sheet */

function Answer({ hidden, children }: { hidden: boolean; children: ReactNode }) {
  const [peek, setPeek] = useState(false)
  useEffect(() => { setPeek(false) }, [hidden])
  const blur = hidden && !peek
  return (
    <div className="relative">
      <div className={cn("transition", blur && "pointer-events-none select-none blur-md")}>{children}</div>
      {blur ? (
        <button type="button" onClick={() => setPeek(true)} className="absolute inset-0 flex items-center justify-center rounded-xl text-sm font-semibold text-navy hover:bg-white/30">
          Say it out loud, then click to check
        </button>
      ) : null}
    </div>
  )
}

function RevisionSheet() {
  const [practise, setPractise] = useState(false)
  return (
    <section id="revision" className="flex scroll-mt-20 flex-col gap-10">
      <div className="flex items-end gap-6 border-b pb-5">
        <div className="flex flex-col gap-2">
          <div className="text-sm font-bold uppercase tracking-[0.1em] text-teal">SoftwareOne Marketplace · Interview questions</div>
          <h2 className="text-4xl font-bold tracking-[-0.02em] text-navy">Your final revision sheet</h2>
          <p className="text-lg text-muted-foreground">Practise these answers out loud before the interview.</p>
        </div>
        <Button variant={practise ? "default" : "outline"} onClick={() => setPractise(v => !v)} className={cn("ml-auto gap-2 rounded-full", practise && "bg-teal hover:bg-teal/90")}>
          {practise ? <EyeOff className="size-4" /> : <Eye className="size-4" />} {practise ? "Practising: answers hidden" : "Practise: hide answers"}
        </Button>
      </div>

      <Card className="rounded-3xl border-0 shadow-sm">
        <CardContent className="flex flex-col gap-4 p-10">
          <div className="text-sm font-bold uppercase tracking-[0.1em] text-teal">01 · Was it driven by usage statistics?</div>
          <Answer hidden={practise}>
            <blockquote className="border-l-4 border-teal pl-6 text-2xl leading-relaxed text-navy">
              “For the object page, Heap and interviews helped identify an information architecture problem. For lifecycle and financial workflows, evidence came primarily from commercial rules and domain discovery. I combined those inputs with design judgement.”
            </blockquote>
          </Answer>
          <div className="mt-2 grid grid-cols-4 gap-3 text-[13px]">
            {[["Heap + interviews", "Object page"], ["Commercial rules", "Lifecycle"], ["Domain discovery", "Change, split billing"], ["Design judgement", "Throughout"]].map(([e, w]) => (
              <div key={e} className="rounded-xl bg-secondary/60 px-4 py-3"><div className="font-semibold text-navy">{e}</div><div className="text-muted-foreground">{w}</div></div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-0 shadow-sm">
        <CardContent className="flex flex-col gap-5 p-10">
          <div className="text-sm font-bold uppercase tracking-[0.1em] text-teal">02 · What was the impact?</div>
          <Answer hidden={practise}>
            <div className="grid grid-cols-4 gap-4">
              {[["19.31%", "Four pages’ view share"], ["#3", "Subscription page rank"], ["2.80%", "Subscription view share"], ["2m 08s", "Engagement (+9%)"]].map(([v, l]) => (
                <div key={l} className="flex flex-col gap-1 rounded-2xl bg-white p-5 ring-1 ring-border">
                  <span className="text-4xl font-bold text-teal tabular">{v}</span>
                  <span className="text-[13px] text-muted-foreground">{l}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-ink">GA4 figures reported in your deck for 16 Sep–13 Oct 2026. Sales could demonstrate subscription management independently; template reuse improved working speed qualitatively.</p>
          </Answer>
          <Callout tone="warn" title="Do not overclaim">Engagement does not establish improved conversion, revenue, task success or time saved. Public docs confirm product rules, not your individual contribution.</Callout>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-0 shadow-sm">
        <CardContent className="flex flex-col gap-4 p-10">
          <div className="text-sm font-bold uppercase tracking-[0.1em] text-teal">03 · What would you do differently?</div>
          <Answer hidden={practise}>
            <blockquote className="border-l-4 border-teal pl-6 text-2xl leading-relaxed text-navy">
              “I would establish baseline task funnels, test risky financial scenarios with representative users and measure successful self-service completion after launch.”
            </blockquote>
          </Answer>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-0 bg-navy text-white shadow-none">
        <CardContent className="flex flex-col gap-4 p-10">
          <div className="text-sm font-bold uppercase tracking-[0.1em] text-teal-light">Before you walk in</div>
          <ul className="grid grid-cols-2 gap-x-10 gap-y-3 text-[17px] leading-relaxed">
            {[
              "Answer the question first; give one concrete example.",
              "Use I for your decisions and we for collaboration.",
              "Distinguish evidence, rules, judgement and outcomes.",
              "Prepare one real collaboration story: different views, options, decision and why.",
              "A rejected design option is not necessarily a feature cut from scope.",
            ].map(t => (
              <li key={t} className="flex gap-3"><span className="mt-2 size-2 shrink-0 rounded-full bg-teal-light" />{t}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}

/* ================================================================ sources */

const SOURCES = [
  ["Subscriptions", "Agreement → subscriptions; related information on object pages."],
  ["Entitlements", "Purchased items are linked to agreements and orders."],
  ["Subscription state diagram / Update Subscription", "Draft and transitional states; API also lists Expired."],
  ["Agreement states / Terminate subscriptions", "Agreement dependencies and Active-only termination."],
  ["Orders", "Changing purchased licence quantities creates a change order."],
  ["Split billing", "Owner default, ELC, invoicing and allocation rules."],
  ["ERP links", "Buyer–seller links and Navision integration example."],
  ["Pricelist items", "Price dependencies and role-based field visibility."],
]

function Sources() {
  return (
    <section id="sources" className="flex scroll-mt-20 flex-col gap-8">
      <div className="flex flex-col gap-2 border-b pb-5">
        <div className="text-sm font-bold uppercase tracking-[0.1em] text-teal">SoftwareOne Marketplace · Source notes</div>
        <h2 className="text-4xl font-bold tracking-[-0.02em] text-navy">Your evidence cheat sheet</h2>
        <p className="text-lg text-muted-foreground">Official documentation to support your technical and commercial reasoning.</p>
      </div>
      <div className="grid grid-cols-2 gap-x-10 gap-y-4">
        {SOURCES.map(([t, d], i) => (
          <div key={t} className="flex gap-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">{i + 1}</span>
            <div><div className="font-semibold text-navy">{t}</div><div className="text-[15px] text-muted-foreground">{d}</div></div>
          </div>
        ))}
      </div>
      <p className="text-[14px] text-muted-foreground">Additional links: Update Subscription · Terminate Subscriptions. (Add the URLs from your worksheet; they aren’t stored here.)</p>
      <Separator />
      <Callout tone="info" title="How to use this evidence">
        The documentation corroborates product behaviour and commercial rules. It does not establish which rules existed at the time of your designs, who first identified requirements, or whether the designs improved outcomes. Use your recollection for ownership and historical decisions; use docs to refresh the domain.
      </Callout>
      <p className="text-[14px] text-muted-foreground">Personal source: your worksheet answers and Brightflag case-study deck. Discovery and validation details for billing, price editing and exceptions remain incomplete.</p>
    </section>
  )
}
