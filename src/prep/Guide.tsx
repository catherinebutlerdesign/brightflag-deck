import { useState, type ReactNode } from "react"
import {
  AlertTriangle, ArrowRight, Calculator, Database, Eye, EyeOff, LayoutTemplate, PieChart, Puzzle, Receipt, Timer, Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Shot, screen, type Box } from "../deck/kit"
import { EVIDENCE, type EvidenceKind } from "./evidence"

/* The visual revision guide at the top of the private page: short chains,
   real screenshots and model answers, built to be glanced at, not read. */

const K = ({ children }: { children: ReactNode }) => <mark className="rounded bg-amber-200/70 px-1 font-semibold text-navy">{children}</mark>

function Ev({ kind, small }: { kind: EvidenceKind; small?: boolean }) {
  return <span className={cn("inline-flex items-center rounded-full font-semibold", small ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-[12px]", EVIDENCE[kind].tone)}>{kind}</span>
}

export function GuideSection({ id, kicker, title, lead, children }: { id: string; kicker: string; title: string; lead?: string; children: ReactNode }) {
  return (
    <section id={id} className="flex scroll-mt-20 flex-col gap-8">
      <div className="flex flex-col gap-1.5 border-b pb-4">
        <div className="text-sm font-bold uppercase tracking-[0.1em] text-teal">{kicker}</div>
        <h2 className="text-4xl font-bold tracking-[-0.02em] text-navy">{title}</h2>
        {lead ? <p className="text-lg text-muted-foreground">{lead}</p> : null}
      </div>
      {children}
    </section>
  )
}

/* ------------------------------------------------------------ evidence key */
export function EvidenceKey() {
  return (
    <div className="grid grid-cols-5 gap-3">
      {(Object.keys(EVIDENCE) as EvidenceKind[]).map(k => (
        <div key={k} className={cn("flex flex-col gap-1 rounded-2xl p-4", EVIDENCE[k].soft)}>
          <Ev kind={k} small />
          <span className="text-[13px] leading-snug">{EVIDENCE[k].what}</span>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------ memory chains */
type Chain = { icon: ReactNode; topic: string; problem: string; answer: string; shot: string; crop: Box; ev: EvidenceKind[]; say: ReactNode }
const CHAINS: Chain[] = [
  { icon: <LayoutTemplate />, topic: "Object page", problem: "fragmented information", answer: "object modelling", shot: "02-detail-general-client", crop: { x: 0, y: 80, w: 1100, h: 460 }, ev: ["Quantitative", "Qualitative", "Design judgement"],
    say: <>Heap showed <K>where</K>, interviews showed <K>why</K>. The object map gave me <K>one template</K>.</> },
  { icon: <Timer />, topic: "Lifecycle", problem: "connected objects", answer: "state-aware actions", shot: "01c-list-needs-attention-client", crop: { x: 1100, y: 230, w: 770, h: 321 }, ev: ["Domain discovery"],
    say: <>Journey mapping showed things are <K>in between</K>. Each state says <K>what you can do</K>.</> },
  { icon: <Receipt />, topic: "Change subscription", problem: "commercial transaction", answer: "review and delta", shot: "32-change-items-increase", crop: { x: 300, y: 118, w: 1570, h: 654 }, ev: ["Domain discovery", "Design judgement"],
    say: <>A quantity change is a <K>change order</K>. So: <K>review, summary, delta</K>, not a modal.</> },
  { icon: <PieChart />, topic: "Split billing", problem: "allocation", answer: "financial transparency", shot: "11-split-modal-error-client", crop: { x: 360, y: 230, w: 1200, h: 500 }, ev: ["Qualitative", "Domain discovery"],
    say: <>People <K>couldn’t find it</K>. Now it’s a tab, with <K>money beside every input</K>.</> },
  { icon: <Calculator />, topic: "Pricing", problem: "mathematical dependencies", answer: "controlled inputs", shot: "21-price-modal-ops-markup12", crop: { x: 644, y: 460, w: 632, h: 263 }, ev: ["Domain discovery", "Technical constraint"],
    say: <>Four values are <K>linked</K>. Pick <K>one input</K>, the rest follow live.</> },
  { icon: <Puzzle />, topic: "Parameters", problem: "vendor variability", answer: "extensibility", shot: "70-params-adobe", crop: { x: 48, y: 408, w: 1000, h: 417 }, ev: ["Domain discovery", "Design judgement"],
    say: <>Each vendor needs <K>different fields</K>. One tab holds <K>whatever they configure</K>.</> },
]

export function MemoryMap() {
  return (
    <div className="grid grid-cols-3 gap-5">
      {CHAINS.map(c => (
        <Card key={c.topic} className="overflow-hidden rounded-3xl border-0 shadow-sm">
          <div className="flex h-[150px] items-center justify-center overflow-hidden bg-[#dfe8ee] p-3">
            <Shot src={screen(c.shot)} crop={c.crop} width={Math.min(340, (126 * c.crop.w) / c.crop.h)} alt={c.topic} />
          </div>
          <CardContent className="flex flex-col gap-3 p-5">
            <div className="flex items-center gap-2 text-navy [&_svg]:size-5 [&_svg]:text-teal">{c.icon}<span className="text-xl font-bold">{c.topic}</span></div>
            <div className="flex flex-wrap items-center gap-1.5 text-[14px] font-semibold">
              <span className="rounded-md bg-red-50 px-2 py-1 text-red-800">{c.problem}</span>
              <ArrowRight className="size-4 text-teal" />
              <span className="rounded-md bg-teal px-2 py-1 text-white">{c.answer}</span>
            </div>
            <p className="text-[15px] leading-relaxed text-ink">{c.say}</p>
            <div className="flex flex-wrap gap-1.5">{c.ev.map(e => <Ev key={e} kind={e} small />)}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------ ownership ladder */
export function OwnershipLadder() {
  const rows = [
    { tier: "Roadmap influence", who: "PMs and the business own it", you: "You brought evidence", detail: <>Heap: <K>poor conversion</K> · Interviews: <K>can’t find split billing</K></>, say: "The roadmap wasn’t mine. I influenced it with evidence.", w: "w-[64%]", tone: "bg-[#e8eff3] text-navy" },
    { tier: "Functional scope", who: "Shared", you: "Discovery changed it", detail: <><K>Transitional states</K> · change = <K>change order</K> → review · split billing <K>in context</K></>, say: "Discovery changed what the product had to do in three places.", w: "w-[82%]", tone: "bg-[#ddeef2] text-[#0b4f5c]" },
    { tier: "Design decisions", who: "Yours", you: "You decided", detail: <><K>Object map</K> · <K>template</K> · hierarchy · tabs · action placement · <K>delta column</K></>, say: "These were my calls.", w: "w-full", tone: "bg-navy text-white [&_mark]:bg-teal-light [&_mark]:text-navy" },
  ]
  return (
    <div className="flex flex-col items-center gap-3">
      {rows.map(r => (
        <div key={r.tier} className={cn("flex items-center gap-6 rounded-2xl px-7 py-5", r.w, r.tone)}>
          <div className="flex w-[210px] shrink-0 flex-col">
            <span className="text-lg font-bold">{r.tier}</span>
            <span className="text-[13px] opacity-75">{r.who}</span>
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <span className="text-[15px]">{r.detail}</span>
            <span className="text-[14px] italic opacity-80">Say: “{r.say}”</span>
          </div>
        </div>
      ))}
      <p className="text-[14px] text-muted-foreground">Never say your recommendations <b>changed the roadmap</b>. Say they <b>shaped functional scope</b>.</p>
    </div>
  )
}

/* ------------------------------------------------------------ eight questions per decision */
const Q8 = ["Problem", "Evidence", "Alternative", "My decision", "Why", "Trade-off", "Validation", "Outcome"] as const
type Row = Record<(typeof Q8)[number], ReactNode>
const DECISIONS: { key: string; label: string; ev: EvidenceKind[]; row: Row }[] = [
  { key: "object", label: "Object page", ev: ["Quantitative", "Qualitative", "Design judgement"], row: {
    Problem: "Lots of information, no structure; actions elsewhere", Evidence: "Heap: poor conversion. Interviews: can’t find split billing", Alternative: "A bespoke page per object",
    "My decision": <><K>Object map</K> → one reusable <K>template</K></>, Why: "Orders, agreements and subscriptions share a structure", "Trade-off": "Less flexibility per page; more consistency and faster work",
    Validation: "PMs, leadership, Customer Success. Not usability testing", Outcome: "Faster working, qualitative only" } },
  { key: "lifecycle", label: "Lifecycle", ev: ["Domain discovery"], row: {
    Problem: "Objects depend on each other; changes take time", Evidence: "Journey mapping and PM discussions", Alternative: "[Your answer, if you had one]",
    "My decision": <>Show <K>in-between states</K> and what each allows</>, Why: "People know what’s safe; conflicting changes are meant to be prevented", "Trade-off": "More conditional logic",
    Validation: "[Confirm]", Outcome: "Not measured. You own the state-change pattern in Figma" } },
  { key: "change", label: "Change subscription", ev: ["Domain discovery", "Design judgement"], row: {
    Problem: "Customers need more licences", Evidence: <>Business rules: quantity change = <K>change order</K></>, Alternative: "Simple edit modal: your own first design",
    "My decision": <>Reuse the <K>ordering pattern</K>; add review, summary and <K>delta column</K></>, Why: "It’s a transaction with money attached", "Trade-off": "More steps, but consequences visible",
    Validation: "Business experts reviewed it", Outcome: "Not measured; would track drop-off at review" } },
  { key: "split", label: "Split billing", ev: ["Qualitative", "Domain discovery"], row: {
    Problem: "People couldn’t find it", Evidence: "Interviews; allocation rules [6]", Alternative: "Leave it in a separate area",
    "My decision": <>A <K>tab</K> with its own Edit; % or seats; <K>live amounts</K></>, Why: "People think in seats; invoices use percentages", "Trade-off": "More detail than a simple form",
    Validation: "[Confirm original feedback]", Outcome: "No measured change in revenue or errors" } },
  { key: "price", label: "Pricing", ev: ["Domain discovery", "Technical constraint"], row: {
    Problem: "Four linked values; circular edits", Evidence: "Price maths; no inline-edit architecture", Alternative: "Inline editing in the table",
    "My decision": <>Pick <K>one input</K>; the rest follow live</>, Why: "Controlled inputs; consequences visible before saving", "Trade-off": "A dialog instead of in-place editing",
    Validation: "[No pricing-specific research]", Outcome: "Not measured" } },
  { key: "params", label: "Parameters", ev: ["Domain discovery", "Design judgement"], row: {
    Problem: "Every vendor needs different information", Evidence: "Vendor product requirements and commercial policies", Alternative: "Fixed screens per vendor (what you avoided)",
    "My decision": <>One <K>Parameters tab</K> for whatever the vendor configures</>, Why: <K>Extensibility</K>, "Trade-off": "A generic layout for very different data (suggested)",
    Validation: "[Confirm]", Outcome: "Same structure across vendors" } },
]

export function DecisionTabs() {
  return (
    <Tabs defaultValue="object" className="flex flex-col gap-5">
      <TabsList className="h-auto w-fit flex-wrap gap-1 rounded-full bg-white p-1.5 shadow-sm">
        {DECISIONS.map(d => (
          <TabsTrigger key={d.key} value={d.key} className="rounded-full px-4 py-2 text-[15px] data-[state=active]:bg-navy data-[state=active]:text-white">{d.label}</TabsTrigger>
        ))}
      </TabsList>
      {DECISIONS.map(d => (
        <TabsContent key={d.key} value={d.key} className="mt-0">
          <div className="mb-3 flex gap-1.5">{d.ev.map(e => <Ev key={e} kind={e} small />)}</div>
          <div className="grid grid-cols-4 gap-3">
            {Q8.map((q, i) => (
              <div key={q} className={cn("flex min-h-[118px] flex-col gap-2 rounded-2xl p-4", q === "My decision" ? "bg-navy text-white [&_mark]:bg-teal-light [&_mark]:text-navy" : "bg-white ring-1 ring-border")}>
                <span className={cn("text-[11px] font-bold uppercase tracking-[0.08em]", q === "My decision" ? "text-teal-light" : "text-teal")}>{i + 1} · {q}</span>
                <span className={cn("text-[16px] leading-snug", q === "My decision" ? "" : "text-ink", typeof d.row[q] === "string" && String(d.row[q]).startsWith("[") && "rounded bg-amber-100 px-1 text-amber-900")}>{d.row[q]}</span>
              </div>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}

/* ------------------------------------------------------------ collaboration story */
export function CollabStory() {
  const steps = [
    ["Problem", "Let customers change quantities"],
    ["Considerations", "Customers want quick. Business experts: it’s a change order, with money attached"],
    ["Options", "Simple edit modal (your first design) or the existing ordering pattern"],
    ["Decision", "You proposed the ordering pattern, with review, summary and a delta column"],
    ["Outcome", "Business experts reviewed the workflow. [Confirm what shipped]"],
  ]
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-5 gap-3">
        {steps.map(([t, d], i) => (
          <div key={t} className={cn("relative flex flex-col gap-2 rounded-2xl p-5", i === 3 ? "bg-navy text-white" : "bg-white ring-1 ring-border")}>
            <span className={cn("flex size-8 items-center justify-center rounded-full text-sm font-bold", i === 3 ? "bg-teal-light text-navy" : "bg-teal text-white")}>{i + 1}</span>
            <span className="text-lg font-bold">{t}</span>
            <span className={cn("text-[14px] leading-snug", i !== 3 && "text-ink")}>{d}</span>
            {i < 4 ? <ArrowRight className="absolute -right-3 top-1/2 z-10 size-5 -translate-y-1/2 rounded-full bg-background text-teal" /> : null}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="flex gap-4 rounded-2xl bg-[#fdf0e2] p-5 text-[#7a4a12]">
          <Database className="mt-1 size-6 shrink-0" />
          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-bold uppercase tracking-[0.08em]">Technical constraint · from the PMs</span>
            <div className="flex flex-wrap items-center gap-2 text-[14px] font-semibold">
              <span className="rounded bg-white/70 px-2 py-1">Process A</span><span className="rounded bg-white/70 px-2 py-1">Process B</span><span className="rounded bg-white/70 px-2 py-1">Process C</span>
              <ArrowRight className="size-4" /><span className="rounded bg-[#a15d26] px-2 py-1 text-white">Navision: data varies</span>
              <ArrowRight className="size-4" /><span className="rounded bg-navy px-2 py-1 text-white">One consistent page</span>
            </div>
            <span className="text-[14px] leading-snug">Commercial data could be entered and structured differently by process. Your job: <K>one consistent customer-facing experience</K>. Don’t claim mapping details.</span>
          </div>
        </div>
        <div className="flex gap-4 rounded-2xl bg-red-50 p-5 text-red-900">
          <AlertTriangle className="mt-1 size-6 shrink-0" />
          <div className="flex flex-col gap-1.5">
            <span className="text-[12px] font-bold uppercase tracking-[0.08em]">If asked for a disagreement</span>
            <span className="text-[14px] leading-snug">There’s <b>no documented disagreement</b> with Engineering. Don’t invent one. Say so, then talk about how constraints shaped decisions: <K>no inline editing</K> and <K>Navision data</K>.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ scope exclusions */
export function ScopeSplit() {
  const rejected = [
    ["Inline editing", "Dialog with controlled inputs", "No inline-edit architecture; linked price values"],
    ["Bespoke page per object", "One reusable template", "Shared structure; consistency; faster work"],
    ["Simple edit modal", "Change order with review and delta", "It’s a commercial transaction"],
  ]
  return (
    <div className="grid grid-cols-[1.5fr_1fr] gap-5">
      <Card className="rounded-3xl border-0 shadow-sm">
        <CardContent className="flex flex-col gap-4 p-7">
          <div className="flex items-center gap-2"><Badge className="rounded-full bg-navy">Rejected design approaches</Badge><span className="text-[13px] text-muted-foreground">A different way to solve the same problem</span></div>
          {rejected.map(([a, b, why]) => (
            <div key={a} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <span className="rounded-lg border border-dashed px-3 py-2 text-[15px] text-muted-foreground line-through">{a}</span>
              <ArrowRight className="size-5 text-teal" />
              <span className="rounded-lg bg-teal px-3 py-2 text-[15px] font-semibold text-white">{b}</span>
              <span className="col-span-3 -mt-1 pl-1 text-[13px] text-muted-foreground">Why: {why}</span>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="rounded-3xl border-0 bg-[#fff8e6] shadow-sm">
        <CardContent className="flex flex-col gap-3 p-7">
          <Badge className="w-fit rounded-full bg-amber-600">Excluded from release scope</Badge>
          <span className="text-[13px] text-amber-900">A feature deliberately not shipped</span>
          <p className="rounded-lg bg-amber-100 px-3 py-2 text-[15px] text-amber-900">[Your example, if you have one.]</p>
          <p className="text-[14px] leading-snug text-ink">If you don’t have one: “Release scope was the PMs’ call. What I can speak to is the approaches I rejected, and why.”</p>
          <p className="text-[13px] text-muted-foreground">Don’t present a rejected design option as a cut feature.</p>
        </CardContent>
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------ parameters */
export function ParamsVisual() {
  return (
    <div className="grid grid-cols-[1fr_1fr_0.9fr] items-start gap-5">
      {[["70-params-adobe", "Adobe", "VIP account number · discount level · discount tier · order number"], ["71-params-microsoft", "Microsoft", "Customer ID · tenant domain · order ID"]].map(([src, v, f]) => (
        <figure key={src} className="flex flex-col gap-2">
          <Shot src={screen(src)} crop={{ x: 48, y: 300, w: 1000, h: 530 }} width={400} alt={`${v} parameters`} />
          <figcaption className="text-[14px]"><b className="text-navy">{v}:</b> <span className="text-muted-foreground">{f}</span></figcaption>
        </figure>
      ))}
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-5 ring-1 ring-border">
        <div className="flex items-center gap-2 text-lg font-bold text-navy"><Puzzle className="size-5 text-teal" />Same tab, different fields</div>
        <div className="text-[14px] leading-snug text-ink"><K>Ordering</K> parameters: collected during purchase.</div>
        <div className="text-[14px] leading-snug text-ink"><K>Fulfilment</K> parameters: provisioning details, like an Adobe VIP Marketplace account number, discount tier or vendor order ID.</div>
        <div className="rounded-lg bg-navy px-3 py-2 text-[14px] text-white">Configurable data, <b>not fixed screens</b> → <b className="text-teal-light">extensibility</b></div>
        <span className="text-[12px] text-muted-foreground">Field lists are the prototype’s sample data.</span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ model answers */
const ANSWERS: [string, ReactNode][] = [
  ["Was it driven by usage statistics?", <>For the object page, yes: <K>Heap showed where</K>, <K>interviews showed why</K>. For lifecycle and billing, mostly <K>commercial rules</K>. I combined those with judgement.</>],
  ["How did you influence product direction?", <>I didn’t own the roadmap. I brought <K>evidence</K>, and discovery <K>changed functional scope</K>: transitional states, a change order with review, split billing in context.</>],
  ["What was your individual contribution?", <>The <K>object map</K>, the <K>reusable template</K>, the state-change pattern, and turning a simple edit modal into a <K>change order with a delta</K>.</>],
  ["Tell me about working with Product and Engineering.", <>Business experts showed me a quantity change is a <K>change order</K>. I proposed the <K>ordering pattern</K> instead of my modal. PMs explained <K>Navision data varied</K>, so I kept one consistent page.</>],
  ["What did you deliberately not build?", <>I rejected <K>inline editing</K>, <K>bespoke pages</K> and a <K>simple modal</K>. Release scope itself was the PMs’ call.</>],
  ["Why add friction to changing a subscription?", <>It’s <K>money and a contract</K>. A review step shows the consequence before you commit.</>],
  ["How did you design for extensibility?", <>Vendors configure <K>parameters</K>. One tab holds whatever they need, so a new vendor <K>doesn’t need a new screen</K>.</>],
  ["How was it validated?", <><K>PMs, leadership and Customer Success</K> reviewed it, and business experts reviewed the change flow. <K>Not usability testing.</K></>],
  ["What was the impact?", <>GA4 shows the pages are <K>heavily used</K>. That’s <K>usage, not proof</K> conversion improved.</>],
  ["What would you do differently?", <>Set up <K>baselines</K> first: task completion, discoverability and the same Heap funnel, <K>before and after</K>.</>],
]

export function ModelAnswers() {
  const [hide, setHide] = useState(false)
  const [shown, setShown] = useState<Record<number, boolean>>({})
  return (
    <div className="flex flex-col gap-4">
      <Button variant={hide ? "default" : "outline"} onClick={() => { setHide(v => !v); setShown({}) }} className={cn("w-fit gap-2 rounded-full", hide && "bg-teal hover:bg-teal/90")}>
        {hide ? <EyeOff className="size-4" /> : <Eye className="size-4" />}{hide ? "Practising: answers hidden" : "Practise: hide answers"}
      </Button>
      <div className="grid grid-cols-2 gap-4">
        {ANSWERS.map(([q, a], i) => {
          const blur = hide && !shown[i]
          return (
            <div key={q} className="flex flex-col gap-2 rounded-2xl bg-white p-5 ring-1 ring-border">
              <span className="text-[16px] font-bold text-navy">{q}</span>
              <button type="button" disabled={!blur} onClick={() => setShown(s => ({ ...s, [i]: true }))} className={cn("text-left text-[15px] leading-relaxed text-ink transition", blur && "cursor-pointer select-none blur-[5px]")}>
                {a}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ watch-outs */
const WATCH: [("high" | "medium"), string, string][] = [
  ["high", "iPhone version", "On the cover badge, the Context card (“plus the iPhone version”) and the appendix. The evidence pack found it conflicts with your files: iOS 27 post-dates your tenure and the prototype was built Oct 2026. Only claim it as SoftwareOne work if you can point to the file."],
  ["high", "“Must total 100%”", "Found only in the October rebuild, not the SoftwareOne Figma. Don’t present it as a SoftwareOne rule unless you’re sure."],
  ["medium", "Template: created or applied?", "Your portfolio says you “applied a consistent object-page structure” using the marketplace’s templates. Your notes say you created it. Be clear which part was yours."],
  ["medium", "Sales demo claim", "Self-reported, with no source. Only say it if you can say who told you."],
  ["medium", "GA4 timing", "Sep–Oct 2026, about six months after you left. It shows adoption, not that your redesign improved anything."],
  ["medium", "Prototype and blueprint", "The prototype is a rebuild from your Figma (Oct 2026). The blueprint is redrawn. Say both once."],
  ["medium", "Still open", "Interview count and participants, Heap figures, released exclusions, lifecycle locks and ELC rationale are still open. Say “I don’t have that to hand” rather than estimate."],
]

export function WatchOuts() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {WATCH.map(([sev, t, d]) => (
        <div key={t} className={cn("flex gap-3 rounded-2xl border p-4", sev === "high" ? "border-red-300 bg-red-50" : "border-amber-300 bg-amber-50")}>
          <AlertTriangle className={cn("mt-0.5 size-5 shrink-0", sev === "high" ? "text-red-700" : "text-amber-700")} />
          <div className="flex flex-col gap-1">
            <span className={cn("text-[15px] font-bold", sev === "high" ? "text-red-900" : "text-amber-900")}>{t}</span>
            <span className="text-[14px] leading-snug text-ink">{d}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export function StrongestEvidence() {
  const items = [
    ["Lead designer", "Home, Agreements, Subscriptions, Orders"],
    ["Named owner in Figma", "The platform’s object state-change pattern, and navigation"],
    ["Change order frames exist", "“Edit Subscription Wizard, change order. Active → Updating”"],
  ]
  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map(([t, d]) => (
        <div key={t} className="flex gap-3 rounded-2xl bg-[#e6f9f2] p-4 text-[#00784d]">
          <Users className="mt-0.5 size-5 shrink-0" />
          <div className="flex flex-col"><span className="font-bold">{t}</span><span className="text-[14px] text-ink">{d}</span></div>
        </div>
      ))}
    </div>
  )
}
