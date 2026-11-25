import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Caption, Eyebrow, Head, Highlight, Marker, Point, Shot, Slide, Status, screen, type Box } from "../deck/kit"

/* Element positions recorded from the running prototype (CSS px at 1920×1080). */
export const B = {
  detail: { hl: { x: 24, y: 164, w: 1872, h: 112 }, edit: { x: 1780, y: 92, w: 58, h: 36 }, more: { x: 1854, y: 92, w: 42, h: 36 }, tabs: { x: 24, y: 300, w: 1872, h: 60 }, chip: { x: 293, y: 106, w: 55, h: 24 } },
  term: { edit: { x: 1780, y: 92, w: 58, h: 36 }, menu: { x: 1696, y: 132, w: 200, h: 193 }, chip: { x: 419, y: 106, w: 88, h: 24 } },
  list: { thStatus: { x: 1757, y: 232, w: 115, h: 37 }, table: { x: 48, y: 232, w: 1824, h: 587 } },
} satisfies Record<string, Record<string, Box>>

/* ---------------------------------------------------------------- 1 Cover */
export function Cover() {
  return (
    <Slide tone="dark">
      <div className="absolute inset-y-0 left-0 z-10 flex w-[860px] flex-col justify-center gap-10 pl-[110px]">
        <Eyebrow dark>SoftwareOne Marketplace · Case study</Eyebrow>
        <h1 className="text-[92px] font-bold leading-[1.02] tracking-[-0.03em] text-balance">
          Enabling safe self-service for complex subscriptions
        </h1>
        <p className="max-w-[640px] text-[30px] leading-[1.4] text-white/70">
          One subscription, three actors: customers, vendors and SoftwareOne operations.
        </p>
        <div className="flex flex-wrap gap-3">
          {["Senior Product Designer", "Shipped", "Desktop + iPhone", "2023–2026"].map(t => (
            <Badge key={t} variant="outline" className="rounded-full border-white/25 px-4 py-1.5 text-[19px] font-medium text-white/85">{t}</Badge>
          ))}
        </div>
        <div className="mt-6 text-[22px] text-white/50">Catherine Butler · Brightflag · Product design interview</div>
      </div>

      {/* Fanned real captures: Operations, Vendor, Client */}
      <div className="absolute left-[930px] top-[96px]">
        {[
          { src: "03-detail-entitlements-ops", label: "Operations", x: 0, y: 0 },
          { src: "03-detail-entitlements-vendor", label: "Vendor", x: 90, y: 300 },
          { src: "03-detail-entitlements-client", label: "Client", x: 180, y: 600 },
        ].map(s => (
          <div key={s.label} className="absolute" style={{ left: s.x, top: s.y }}>
            <Shot src={screen(s.src)} crop={{ x: 0, y: 80, w: 1920, h: 560 }} width={1080} alt={`${s.label} view of the subscription`} />
            <Badge className="absolute -top-4 left-[480px] rounded-full bg-teal-light px-4 py-1 text-[18px] font-semibold text-navy shadow">{s.label}</Badge>
          </div>
        ))}
      </div>
    </Slide>
  )
}

/* ---------------------------------------------------------------- 2 Context */
const nodes: { id: string; x: number; y: number; w: number; title: string; sub: string; main?: boolean }[] = [
  { id: "agr", x: 330, y: 0, w: 360, title: "Agreement", sub: "The commercial contract with the vendor" },
  { id: "ord", x: 0, y: 190, w: 280, title: "Orders", sub: "Purchase · Change · Terminate" },
  { id: "sub", x: 360, y: 190, w: 300, title: "Subscription", sub: "Status, terms, renewal, price", main: true },
  { id: "ent", x: 740, y: 190, w: 280, title: "Entitlements", sub: "Items, quantities, unit prices" },
  { id: "buy", x: 0, y: 390, w: 300, title: "Buyers", sub: "Who is billed, incl. split billing" },
  { id: "lic", x: 360, y: 390, w: 300, title: "Licensee & seller", sub: "Who uses it, who sells it" },
  { id: "prd", x: 720, y: 390, w: 300, title: "Vendor product", sub: "Catalogue, billing model, terms" },
]
const edges: [string, string][] = [["agr", "sub"], ["ord", "sub"], ["sub", "ent"], ["sub", "buy"], ["sub", "lic"], ["sub", "prd"]]
const NH = 120
const centre = (id: string) => { const n = nodes.find(n => n.id === id)!; return { x: n.x + n.w / 2, y: n.y + NH / 2 } }

export function Context() {
  return (
    <Slide>
      <div className="absolute left-[100px] top-[80px] w-[1100px]">
        <Head
          eyebrow="01 · Context"
          title="One subscription. Many connected records."
          lead="SoftwareOne Marketplace was an enterprise platform for buying and managing software. Every subscription was tied to other business objects, each with its own status and permitted actions."
        />
      </div>

      <div className="absolute left-[100px] top-[420px] h-[510px] w-[1020px]">
        <svg className="absolute inset-0 overflow-visible" width={1020} height={510}>
          {edges.map(([a, b]) => { const p = centre(a), q = centre(b); return <line key={a + b} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#76cad2" strokeWidth={3} strokeDasharray={a === "ord" ? "8 8" : undefined} /> })}
        </svg>
        {nodes.map(n => (
          <div
            key={n.id}
            className={cn("absolute flex flex-col justify-center gap-1.5 rounded-xl border px-6", n.main ? "border-navy bg-navy text-white shadow-xl" : "bg-white shadow-sm")}
            style={{ left: n.x, top: n.y, width: n.w, height: NH }}
          >
            <div className="text-[26px] font-semibold">{n.title}</div>
            <div className={cn("text-[18px] leading-snug", n.main ? "text-white/70" : "text-muted-foreground")}>{n.sub}</div>
          </div>
        ))}
      </div>

      <Card className="absolute right-[100px] top-[420px] w-[560px] rounded-2xl border-0 shadow-sm">
        <CardHeader className="p-8 pb-4">
          <CardTitle className="text-[22px] uppercase tracking-[0.08em] text-teal">My role</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 p-8 pt-0 text-[23px] leading-snug text-ink">
          <p>Senior Product Designer on the subscription, order and agreement experiences.</p>
          <Separator />
          <p>Mapped the actors, systems and dependencies behind a subscription with subject-matter experts.</p>
          <Separator />
          <p>Designed the list, object page, change and termination flows, split billing and item pricing, plus the iPhone version.</p>
          <Separator />
          <p>Partnered with Product and Engineering inside existing platform templates.</p>
        </CardContent>
      </Card>

      <div className="absolute bottom-[60px] left-[100px] flex items-center gap-4 text-[20px] text-muted-foreground">
        <span className="inline-block h-[3px] w-10 bg-teal-light" /> owns or references
        <span className="ml-6 inline-block h-[3px] w-10 border-t-[3px] border-dashed border-teal-light" /> creates or changes
      </div>
    </Slide>
  )
}

/* ---------------------------------------------------------------- 3 Problem */
const actors = [
  { who: "Client", org: "e.g. Stark Industries", line: "Needs to understand what they own and manage it safely.", sees: "Sell price (SPx)" },
  { who: "Vendor", org: "e.g. Adobe", line: "Supplies the product and its commercial conditions.", sees: "Purchase price (PPx)" },
  { who: "Operations", org: "SoftwareOne", line: "Handles agreements, approvals and the exceptional cases.", sees: "PPx → yield → SPx" },
]
export function Problem() {
  return (
    <Slide>
      <div className="absolute left-[100px] top-[80px] w-[960px]">
        <Head
          eyebrow="02 · Problem"
          title="Nobody could see the whole subscription."
          lead="Pricing, renewals, ownership and operational status were spread across systems and teams. Customers leaned on account managers to tell them what a subscription meant, who controlled it and which actions were safe."
        />
      </div>

      <div className="absolute right-[100px] top-[80px] flex w-[640px] flex-col gap-6 rounded-2xl bg-navy p-10 text-white">
        <Eyebrow dark>The challenge</Eyebrow>
        <p className="text-[32px] font-semibold leading-[1.3]">
          Let several actors view, request and complete subscription changes without conflicting agreement updates, while making status, ownership and consequences clear.
        </p>
      </div>

      <div className="absolute left-[100px] right-[100px] top-[500px] grid grid-cols-3 gap-8">
        {actors.map((a, n) => (
          <Card key={a.who} className="rounded-2xl border-0 shadow-sm">
            <CardContent className="flex flex-col gap-5 p-9">
              <div className="flex items-baseline justify-between">
                <span className="text-[34px] font-bold text-navy">{a.who}</span>
                <span className="text-[18px] text-muted-foreground">{a.org}</span>
              </div>
              <p className="min-h-[96px] text-[24px] leading-snug text-ink">{a.line}</p>
              <Separator />
              <div className="flex items-center justify-between text-[20px]">
                <span className="text-muted-foreground">Owns the number</span>
                <Badge variant="secondary" className={cn("rounded-md px-3 py-1 text-[19px] font-semibold", n === 2 && "bg-navy text-white")}>{a.sees}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="absolute bottom-[80px] left-[100px] right-[100px] flex items-center gap-8 border-t border-border pt-8">
        <span className="shrink-0 text-[19px] font-bold uppercase tracking-[0.08em] text-teal">Why it mattered</span>
        {["Unclear information slows operational decisions", "Financial edits demand confidence and traceability", "Exception states are part of everyday work"].map(t => (
          <span key={t} className="text-[22px] leading-snug text-ink">{t}</span>
        ))}
      </div>
    </Slide>
  )
}

/* ---------------------------------------------------------------- 4 Discovery */
const MOMENTS = ["Order placed", "Processing", "Active order", "Live subscription", "Next: change"]
type Lane = { key: string; label: string; sub: string; tone: string; cells: Record<number, string[]> }
const LANES: Lane[] = [
  { key: "client", label: "Client", sub: "Actions", tone: "bg-[#e2f2f4] border-[#76cad2] text-[#0b4f5c]", cells: { 0: ["Client creates an order"], 1: ["Views processing order"], 2: ["Views active order"], 3: ["Views active subscription"], 4: ["Changes item quantity in subscription"] } },
  { key: "front", label: "Frontstage", sub: "SoftwareOne UI", tone: "bg-white border-border text-ink", cells: { 0: ["Displays pricing, term and billing frequency"], 1: ["Confirms order placement"], 2: ["Displays renewal date (post-fulfilment)", "Displays subscriptions"], 3: ["Displays subscriptions"] } },
  { key: "vendor", label: "Vendor", sub: "Visible actions", tone: "bg-[#fff3e4] border-[#f0c48a] text-[#7a4a12]", cells: { 1: ["Creates subscription", "Processes order"] } },
  { key: "back", label: "Back stage", sub: "SoftwareOne", tone: "bg-[#eef1f4] border-[#cfd8df] text-ink", cells: { 0: ["Creates order record", "Sends fulfilment request to vendor"], 1: ["Waits for vendor’s response", "Receives subscription data (start date, grouping, renewal)", "Stores subscription in system"] } },
  { key: "vback", label: "Back stage", sub: "Vendor", tone: "bg-[#fff3e4] border-[#f0c48a] text-[#7a4a12]", cells: { 1: ["Reviews order items", "Applies product & commercial rules", "Decides: new vs existing subscription grouping", "Activates subscription", "Sends confirmation back"] } },
]
const COLS = "190px 0.9fr 1.9fr 1fr 1fr 1fr"
export function Discovery() {
  return (
    <Slide tone="white">
      <div className="absolute left-[100px] top-[70px] flex w-[1720px] items-end justify-between gap-16">
        <Head eyebrow="03 · Discovery" title="Mapping the service before designing the screens." className="w-[1000px]" />
        <div className="flex w-[620px] flex-col gap-3 pb-2">
          <div className="text-[19px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Methods</div>
          <div className="flex flex-wrap gap-2.5">
            {["Heap analytics (PyraCloud)", "User interviews", "Object relationship map", "Service blueprint", "SME sessions on lifecycle rules"].map(m => (
              <Badge key={m} variant="secondary" className="rounded-full px-4 py-1.5 text-[18px] font-medium">{m}</Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute left-[100px] top-[300px] w-[1720px]">
        <div className="grid gap-x-3" style={{ gridTemplateColumns: COLS }}>
          <div />
          {MOMENTS.map((m, i) => (
            <div key={m} className={cn("rounded-t-lg px-4 py-3 text-[19px] font-semibold", i === 4 ? "bg-teal text-white" : "bg-navy text-white")}>
              <span className="mr-2 opacity-60">0{i + 1}</span>{m}
            </div>
          ))}
        </div>
        {LANES.map((l, li) => (
          <div key={l.key}>
            {li === 1 || li === 3 ? (
              <div className="my-1.5 flex items-center gap-3 text-[14px] uppercase tracking-[0.1em] text-muted-foreground">
                <span className="w-[190px] shrink-0 text-right pr-3">{li === 1 ? "Line of interaction" : "Line of visibility"}</span>
                <span className="h-px flex-1 border-t-2 border-dashed border-[#b8c7d1]" />
              </div>
            ) : null}
            <div className="grid gap-x-3 border-b border-border/60 py-2" style={{ gridTemplateColumns: COLS }}>
              <div className="flex flex-col justify-center pr-3 text-right">
                <span className="text-[19px] font-semibold text-navy">{l.label}</span>
                <span className="text-[15px] text-muted-foreground">{l.sub}</span>
              </div>
              {[0, 1, 2, 3, 4].map(c => (
                <div key={c} className="flex min-h-[44px] flex-wrap content-start gap-1.5">
                  {(l.cells[c] || []).map(t => (
                    <div key={t} className={cn("rounded-md border px-2.5 py-1 text-[14px] leading-snug", l.tone, c === 4 && "border-teal bg-teal text-white")}>{t}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-[36px] left-[100px] right-[100px] grid grid-cols-3 gap-8 text-[19px] leading-snug text-ink">
        {[
          ["One shared model", "Product, Design and Engineering saw the same journey."],
          ["Where ambiguity lives", "Between order and subscription, where status goes quiet."],
          ["Rules made explicit", "Lifecycle constraints became design inputs per state and actor."],
        ].map(([t, d]) => (
          <div key={t} className="flex flex-col gap-1.5 border-l-4 border-teal pl-5">
            <span className="font-semibold text-navy">{t}</span>
            <span className="text-muted-foreground">{d}</span>
          </div>
        ))}
      </div>
    </Slide>
  )
}

/* ---------------------------------------------------------------- 5 Scope */
const scopeShots: { src: string; crop: Box; title: string; why: string }[] = [
  { src: "02-detail-general-client", crop: { x: 0, y: 80, w: 1100, h: 420 }, title: "A useful object page", why: "Summary, state and the next valid action in one place." },
  { src: "11-split-modal-error-client", crop: { x: 360, y: 300, w: 1200, h: 470 }, title: "Split billing comprehension", why: "Allocation, amounts and totals at the point of edit." },
  { src: "21-price-modal-ops-markup12", crop: { x: 644, y: 260, w: 632, h: 560 }, title: "Item-price adjustment", why: "Operations pricing and markup without guesswork." },
  { src: "53-select-items-mismatch", crop: { x: 260, y: 120, w: 1400, h: 460 }, title: "Clear exception states", why: "Blocked actions that explain the rule and the way forward." },
]
export function Scope() {
  return (
    <Slide>
      <div className="absolute left-[100px] top-[80px] w-[1100px]">
        <Head eyebrow="04 · Scope" title="Deciding what matters in version one." lead="The most senior design decision is often what not to build. These four workflows carried the risk." />
      </div>

      <div className="absolute left-[100px] top-[400px] grid w-[1130px] grid-cols-2 gap-x-8 gap-y-7">
        {scopeShots.map((s, i) => (
          <div key={s.title} className="flex flex-col gap-3">
            <div className="flex h-[210px] items-center justify-center overflow-hidden rounded-2xl bg-[#dfe8ee] p-4">
              <Shot src={screen(s.src)} crop={s.crop} width={Math.min(520, (178 * s.crop.w) / s.crop.h)} alt={s.title} />
            </div>
            <div className="flex items-start gap-3">
              <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-teal text-[18px] font-bold text-white">{i + 1}</span>
              <div>
                <div className="text-[23px] font-semibold text-navy">{s.title}</div>
                <div className="text-[19px] text-muted-foreground">{s.why}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Card className="absolute right-[100px] top-[400px] w-[520px] rounded-2xl border-0 bg-navy text-white shadow-none">
        <CardContent className="flex flex-col gap-6 p-10">
          <Eyebrow dark>Delivery constraints</Eyebrow>
          {[
            ["Existing templates", "Reuse the platform’s collection and object-page patterns."],
            ["Technical debt", "Architectural limits shaped what could change, and when."],
            ["No inline editing", "Not supported for the relevant flows, so edits needed another pattern."],
            ["Connected objects", "Every change touches agreements, orders and billing."],
          ].map(([t, d]) => (
            <div key={t} className="flex flex-col gap-1">
              <span className="text-[24px] font-semibold">{t}</span>
              <span className="text-[19px] leading-snug text-white/65">{d}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </Slide>
  )
}

/* ---------------------------------------------------------------- 6 Lifecycle */
type St = { id: string; label: "Active" | "Updating" | "Terminating" | "Terminated" | "Expired"; x: number; y: number; can: string }
const STATES: St[] = [
  { id: "a", label: "Active", x: 0, y: 220, can: "Edit, change, split billing, terminate" },
  { id: "u", label: "Updating", x: 480, y: 0, can: "Change order in flight. Edit locked until it completes" },
  { id: "t", label: "Terminating", x: 480, y: 220, can: "Termination in flight. Edit and terminate locked" },
  { id: "e", label: "Expired", x: 480, y: 440, can: "Auto-renew was off. History stays visible" },
  { id: "x", label: "Terminated", x: 920, y: 220, can: "No entitlements, no prices. Read-only" },
]
const SW = 300
const SH = 140
export function Lifecycle() {
  const at = (id: string) => STATES.find(s => s.id === id)!
  const R = (id: string) => { const s = at(id); return { l: s.x, r: s.x + SW, t: s.y, b: s.y + SH, cx: s.x + SW / 2, cy: s.y + SH / 2 } }
  const a = R("a"), u = R("u"), t = R("t"), e = R("e"), x = R("x")
  const arrows = [
    { d: `M ${a.cx} ${a.t} C ${a.cx} ${u.cy - 20}, ${u.l - 120} ${u.cy - 20}, ${u.l} ${u.cy - 20}`, label: "Change order placed", lx: 40, ly: 28 },
    { d: `M ${u.l} ${u.cy + 30} C ${u.l - 90} ${u.cy + 30}, ${a.r - 40} ${a.t - 40}, ${a.r - 40} ${a.t}`, label: "Completed, or failed", lx: 250, ly: 150 },
    { d: `M ${a.r} ${a.cy} L ${t.l} ${t.cy}`, label: "Terminate", lx: 335, ly: 252 },
    { d: `M ${t.r} ${t.cy} L ${x.l} ${x.cy}`, label: "Completed", lx: 790, ly: 252 },
    { d: `M ${a.cx} ${a.b} C ${a.cx} ${e.cy}, ${e.l - 120} ${e.cy}, ${e.l} ${e.cy}`, label: "Renewal date passes", lx: 40, ly: 535 },
  ]
  return (
    <Slide tone="white">
      <div className="absolute left-[100px] top-[80px] w-[1100px]">
        <Head eyebrow="05 · Systems thinking" title="Design the lifecycle, not just the page." lead="Each state decides which actions exist for each actor. Status became something to act on, not just metadata." />
      </div>

      <div className="absolute left-[100px] top-[410px] h-[600px] w-[1220px]">
        <svg className="absolute inset-0 overflow-visible" width={1220} height={600}>
          <defs>
            <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill="#087c90" />
            </marker>
          </defs>
          {arrows.map(p => <path key={p.label} d={p.d} fill="none" stroke="#087c90" strokeWidth={3} markerEnd="url(#arr)" />)}
        </svg>
        {arrows.map(p => (
          <span key={p.label} className="absolute whitespace-nowrap rounded bg-white px-2 text-[17px] font-medium text-teal" style={{ left: p.lx, top: p.ly }}>{p.label}</span>
        ))}
        {STATES.map(s => (
          <div key={s.id} className={cn("absolute flex flex-col gap-3 rounded-2xl border bg-white p-5 shadow-sm", s.id === "a" && "border-2 border-[#00784d]/40")} style={{ left: s.x, top: s.y, width: SW, height: SH }}>
            <Status className="self-start">{s.label}</Status>
            <span className="text-[18px] leading-snug text-ink">{s.can}</span>
          </div>
        ))}
      </div>

      <div className="absolute right-[100px] top-[150px] flex w-[470px] flex-col gap-5">
        <Shot src={screen("61-status-terminating-menu")} crop={{ x: 1460, y: 80, w: 460, h: 270 }} width={470} alt="Terminating subscription with Edit and Terminate disabled">
          <Highlight box={B.term.edit} />
          <Marker n={1} x={1748} y={110} />
          <Marker n={2} x={1672} y={300} />
        </Shot>
        <Caption>Real capture: a Terminating subscription, client view.</Caption>
        <div className="flex flex-col gap-6 pt-2">
          <Point n={1} title="Edit is disabled, not hidden">Its tooltip says why: only active subscriptions can be edited.</Point>
          <Point n={2} title="The menu keeps its shape">Unavailable actions stay in place, greyed, so the page doesn’t shift between states.</Point>
          <Point n={3} title="A “Needs attention” view">Updating, Terminating and Expired surface together in the list.</Point>
        </div>
      </div>
    </Slide>
  )
}

