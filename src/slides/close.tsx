import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { ArrowRight, ExternalLink } from "lucide-react"
import { Caption, Eyebrow, Head, Slide, screen } from "../deck/kit"

/* ---------------------------------------------------------------- 13 Collaboration */
export function Collaboration() {
  const col = (title: string, items: string[], tone: "white" | "navy" = "white") => (
    <Card className={cn("rounded-2xl border-0 shadow-sm", tone === "navy" && "bg-navy text-white")}>
      <CardHeader className="p-9 pb-4"><CardTitle className={cn("text-[22px] uppercase tracking-[0.08em]", tone === "navy" ? "text-teal-light" : "text-teal")}>{title}</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-4 p-9 pt-0">
        {items.map((t, i) => (
          <div key={t} className="flex flex-col gap-4">
            {i ? <Separator className={tone === "navy" ? "bg-white/15" : undefined} /> : null}
            <span className={cn("text-[22px] leading-snug", tone === "navy" ? "text-white/90" : "text-ink")}>{t}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
  return (
    <Slide>
      <div className="absolute left-[100px] top-[80px] w-[1200px]">
        <Head eyebrow="12 · Collaboration" title="Product judgement meets engineering reality." lead="Designing a useful experience also means negotiating the feasible one." />
      </div>
      <div className="absolute left-[100px] right-[100px] top-[380px] grid grid-cols-3 gap-8">
        {col("With Product", ["Clarify the most important user problem.", "Define a release boundary, and what can wait.", "Keep exception handling in scope."])}
        {col("Shared artefacts", ["Service blueprint: one model of the journey.", "Four scenarios tested in every review: purchase, spot what needs attention, know who acts next, change without conflict.", "Clickable prototypes for each actor."], "navy")}
        {col("With Engineering", ["Surface dependencies and tech debt early.", "Discuss alternatives to inline editing.", "Use existing templates without losing clarity."])}
      </div>
      <div className="absolute left-[100px] right-[100px] top-[780px] flex items-center gap-6 rounded-2xl border-2 border-dashed border-teal/40 px-10 py-7">
        {["Differing views", "Options on the table", "Decision and why"].map((t, i) => (
          <div key={t} className="flex items-center gap-6">
            {i ? <ArrowRight className="size-7 text-teal" /> : null}
            <span className="text-[24px] font-semibold text-navy">{t}</span>
          </div>
        ))}
        <span className="ml-auto text-[19px] text-muted-foreground">Tell one real story in this shape</span>
      </div>
    </Slide>
  )
}

/* ---------------------------------------------------------------- 14 Outcomes */
const PAGES = [
  { page: "/commerce/agreements", rank: 2, share: "4.15%", sec: 193, vs: "+65%" },
  { page: "/commerce/orders", rank: 4, share: "2.23%", sec: 130, vs: "+11%" },
  { page: "/commerce/subscriptions", rank: 3, share: "2.80%", sec: 128, vs: "+9%", me: true },
  { page: "/home", rank: 1, share: "10.13%", sec: 85, vs: "−27%" },
]
const AVG = 117
const mmss = (s: number) => `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`
export function Outcomes() {
  const max = 240
  return (
    <Slide tone="white">
      <div className="absolute left-[100px] top-[80px] w-[1200px]">
        <Head eyebrow="13 · Outcomes" title="Evidence of adoption and sales enablement." />
      </div>

      <div className="absolute left-[100px] top-[300px] flex w-[520px] flex-col gap-4">
        <div className="text-[150px] font-bold leading-none tracking-[-0.04em] text-teal tabular">19.31%</div>
        <p className="text-[26px] leading-snug text-ink">of all Marketplace page views went to four pages I designed: home, agreements, subscriptions and orders.</p>
        <p className="text-[19px] text-muted-foreground">Four pages together, not subscription usage alone.</p>
        <Separator className="my-4" />
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-1"><span className="text-[54px] font-bold text-navy">#3</span><span className="text-[19px] text-muted-foreground">Subscriptions’ rank among 165,102 page paths</span></div>
          <div className="flex flex-col gap-1"><span className="text-[54px] font-bold text-navy">+65%</span><span className="text-[19px] text-muted-foreground">Agreements engagement vs the site average</span></div>
        </div>
      </div>

      <div className="absolute left-[720px] top-[300px] flex w-[1100px] flex-col gap-6">
        <div className="text-[22px] font-semibold text-navy">Average engagement time per active user</div>
        <div className="relative flex flex-col gap-5 pt-2">
          <div className="absolute bottom-0 top-0 z-10 border-l-2 border-dashed border-navy/50" style={{ left: 250 + (AVG / max) * 640 }}>
            <span className="absolute -top-7 -translate-x-1/2 whitespace-nowrap text-[16px] font-medium text-navy/70">Site average {mmss(AVG)}</span>
          </div>
          {PAGES.map(p => (
            <div key={p.page} className="flex items-center gap-4">
              <span className={cn("w-[236px] shrink-0 text-right font-mono text-[17px]", p.me ? "font-bold text-teal" : "text-ink")}>{p.page}</span>
              <div className="h-[40px] rounded-md" style={{ width: (p.sec / max) * 640, background: p.me ? "#087c90" : "#76cad2" }} />
              <span className="tabular text-[19px] font-semibold text-navy">{mmss(p.sec)}</span>
              <span className={cn("tabular text-[17px]", p.vs.startsWith("+") ? "text-[#00784d]" : "text-muted-foreground")}>{p.vs}</span>
            </div>
          ))}
        </div>
        <Table className="mt-3 text-[17px]">
          <TableHeader>
            <TableRow><TableHead>Page</TableHead><TableHead className="text-right">Rank by views</TableHead><TableHead className="text-right">Share of views</TableHead><TableHead className="text-right">vs site average</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {[...PAGES].sort((a, b) => a.rank - b.rank).map(p => (
              <TableRow key={p.page}><TableCell className="font-mono">{p.page}</TableCell><TableCell className="text-right tabular">{p.rank}</TableCell><TableCell className="text-right tabular">{p.share}</TableCell><TableCell className="text-right tabular">{p.vs}</TableCell></TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="absolute bottom-[70px] left-[100px] right-[100px] flex items-center gap-8 rounded-2xl bg-navy px-10 py-7 text-white">
        <Badge className="rounded-full bg-teal-light px-4 py-1 text-[18px] font-semibold text-navy">Business enablement</Badge>
        <span className="text-[24px]">Sales could demo subscription management on their own, without Product or Engineering in the room.</span>
      </div>
      <div className="absolute bottom-[24px] left-[100px] text-[15px] text-muted-foreground">Source: GA4, Marketplace production, Pages and screens, 28 days (16 Sep – 13 Oct 2026). Feature-level task success was not measured.</div>
    </Slide>
  )
}

/* ---------------------------------------------------------------- 15 Reflection */
export function Reflection() {
  return (
    <Slide tone="dark">
      <div className="absolute left-[110px] top-[110px] w-[1500px]">
        <Eyebrow dark>14 · Reflection</Eyebrow>
        <p className="mt-8 text-[66px] font-bold leading-[1.12] tracking-[-0.02em] text-balance">
          Make complex business logic understandable <span className="text-teal-light">at the point of action.</span>
        </p>
      </div>
      <div className="absolute left-[110px] right-[110px] top-[520px] grid grid-cols-2 gap-16">
        {[
          ["What I learned", ["In a multi-actor system, a shared state and ownership model matters more than any single screen.", "The exception is often the actual use case.", "Financial clarity is part of trust."]],
          ["What I’d do differently", ["Measure task outcomes, not only page engagement.", "Validate risky financial edge cases earlier.", "Hand off a clear lifecycle model alongside the designs."]],
        ].map(([t, items]) => (
          <div key={t as string} className="flex flex-col gap-6">
            <div className="text-[22px] font-bold uppercase tracking-[0.08em] text-teal-light">{t as string}</div>
            {(items as string[]).map(i => (
              <div key={i} className="border-l-2 border-white/20 pl-6 text-[27px] leading-snug text-white/85">{i}</div>
            ))}
          </div>
        ))}
      </div>
    </Slide>
  )
}

/* ---------------------------------------------------------------- 16 Why Brightflag */
const MAP = [
  ["Agreements, orders, subscriptions", "Matters, invoices, budgets"],
  ["Vendor and commercial relationships", "Law firms and legal spend"],
  ["Billing, states, dependencies, exceptions", "Approval workflows and billing exceptions"],
]
export function WhyBrightflag() {
  return (
    <Slide tone="white">
      <div className="absolute left-[100px] top-[80px] w-[1300px]">
        <Head eyebrow="15 · Why Brightflag" title="New industry. Familiar design problems." lead="Legal technology has different rules, but the same kind of enterprise complexity." />
      </div>
      <div className="absolute left-[100px] right-[100px] top-[420px] flex flex-col gap-6">
        <div className="grid grid-cols-[1fr_120px_1fr] text-[22px] font-bold uppercase tracking-[0.08em]">
          <span className="text-muted-foreground">SoftwareOne</span><span /><span className="text-teal">Brightflag</span>
        </div>
        {MAP.map(([a, b]) => (
          <div key={a} className="grid grid-cols-[1fr_120px_1fr] items-center">
            <div className="rounded-2xl bg-background px-9 py-8 text-[30px] font-semibold text-navy">{a}</div>
            <div className="flex items-center justify-center"><div className="h-[3px] w-full bg-teal-light" /><ArrowRight className="-ml-3 size-8 shrink-0 text-teal" /></div>
            <div className="rounded-2xl bg-navy px-9 py-8 text-[30px] font-semibold text-white">{b}</div>
          </div>
        ))}
      </div>
    </Slide>
  )
}

/* ---------------------------------------------------------------- Appendix: prototypes */
export function Prototypes() {
  const link = (label: string, url: string) => (
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-2 text-[24px] font-semibold text-navy">{label}<ExternalLink className="size-5 text-teal" /></span>
      <span className="font-mono text-[17px] text-teal">{url}</span>
    </div>
  )
  return (
    <Slide>
      <div className="absolute left-[100px] top-[80px] w-[760px]">
        <Head eyebrow="Appendix · Live prototypes" title="Explore the real product work." lead="Interactive prototypes rebuilt from the Commerce Figma file, on SoftwareOne design system tokens." />
        <div className="mt-12 flex flex-col gap-8">
          {link("Desktop prototype", "catherinebutlerdesign.github.io/subscriptions-prototype/subscriptions-prototype.html")}
          {link("iPhone prototype", "catherinebutlerdesign.github.io/subscriptions-prototype/subscriptions-mobile.html")}
          {link("Case study", "catherinebutlerdesign.github.io/#subscriptions")}
        </div>
        <Caption className="mt-10">Reconstructed prototypes, not production captures. All names, IDs and amounts are sample data.</Caption>
      </div>
      <div className="absolute right-[90px] top-[110px] flex gap-6">
        {[
          ["ios-list", "List · Client"],
          ["ios-client", "Sell price · Client"],
          ["ios-vendor", "Purchase price · Vendor"],
          ["ios-ops", "Both + yield · Ops"],
        ].map(([src, label], i) => (
          <div key={src} className="flex flex-col items-center gap-3" style={{ marginTop: i % 2 ? 80 : 0 }}>
            <img src={screen(src)} alt={label} className="w-[215px] rounded-[28px] shadow-[0_30px_60px_-20px_rgba(16,37,58,0.4)] ring-1 ring-navy/10" />
            <Caption className="text-[16px]">{label}</Caption>
          </div>
        ))}
      </div>
    </Slide>
  )
}

/* ---------------------------------------------------------------- Appendix: discussion + questions */
function TwoLists({ eyebrow, title, lead, a, b }: { eyebrow: string; title: string; lead: string; a: [string, string[]]; b: [string, string[]] }) {
  return (
    <Slide>
      <div className="absolute left-[100px] top-[80px] w-[1300px]"><Head eyebrow={eyebrow} title={title} lead={lead} /></div>
      <div className="absolute left-[100px] right-[100px] top-[420px] grid grid-cols-2 gap-10">
        {[a, b].map(([t, items]) => (
          <Card key={t} className="rounded-2xl border-0 shadow-sm">
            <CardHeader className="p-10 pb-4"><CardTitle className="text-[22px] uppercase tracking-[0.08em] text-teal">{t}</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-5 p-10 pt-0">
              {items.map((q, i) => (
                <div key={q} className="flex flex-col gap-5">
                  {i ? <Separator /> : null}
                  <span className="text-[24px] leading-snug text-ink">{q}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </Slide>
  )
}
export const Discussion = () => (
  <TwoLists
    eyebrow="Appendix · Deep dive"
    title="Ready for the deep dive."
    lead="The decisions underneath the polished output."
    a={["Product thinking", ["Which problems did you deliberately exclude?", "What was your role in shaping the scope?", "Which user evidence changed a decision?", "What competing solution did you reject?"]]}
    b={["Design + engineering", ["How did object states map to available actions?", "How did technical debt change the interface?", "How was quality evaluated?", "What would you measure after release?"]]}
  />
)
export const Questions = () => (
  <TwoLists
    eyebrow="Appendix · Your questions"
    title="Questions for the Brightflag team."
    lead="Ask the most relevant two or three in the final minutes."
    a={["Product challenge", ["Where do clients struggle most with matter and invoice workflows?", "Where does AI assist, and where does it automate the user’s decision?"]]}
    b={["Design culture", ["How much ownership do designers have over MVP scope?", "What does strong visual craft mean in the Brightflag product?", "How are Product, Design and Engineering trade-offs resolved?"]]}
  />
)
