import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowRight } from "lucide-react"
import { Caption, Eyebrow, Head, Highlight, Marker, Point, Shot, Slide, Status, screen, type Box } from "../deck/kit"

/* ---------------------------------------------------------------- 7 Change flow */
const FLOW: { src: string; crop: Box; step: string; title: string; text: string; marks: { n: number; x: number; y: number }[]; hl?: Box }[] = [
  { src: "31-change-items-reduce-error", crop: { x: 300, y: 118, w: 1570, h: 540 }, step: "Items", title: "Quantities, with the rule built in", text: "Committed terms can only be reduced at renewal, and the error names the date.", marks: [{ n: 1, x: 1092, y: 404 }, { n: 2, x: 304, y: 565 }] },
  { src: "34-change-splitstep-picked", crop: { x: 300, y: 118, w: 1570, h: 540 }, step: "Split billing", title: "Who pays for this change", text: "On split subscriptions, bill one buyer, or None to follow the split percentages.", marks: [{ n: 3, x: 304, y: 432 }] },
  { src: "36-change-review", crop: { x: 300, y: 118, w: 1570, h: 540 }, step: "Review", title: "The delta, not the whole bill", text: "Review shows +4 and the change in SPx before Place order.", marks: [{ n: 4, x: 1218, y: 462 }] },
  { src: "38-after-change-updating", crop: { x: 0, y: 80, w: 1920, h: 661 }, step: "Result", title: "The subscription says what’s happening", text: "Status moves to Updating and Edit locks until the order completes.", marks: [{ n: 5, x: 380, y: 118 }, { n: 6, x: 1809, y: 110 }] },
]
export function ChangeFlow() {
  return (
    <Slide tone="white">
      <div className="absolute left-[100px] top-[70px] flex w-[1720px] items-end justify-between">
        <Head eyebrow="06 · Workflow" title="Changing a live subscription." className="w-[1100px]" />
        <div className="flex items-center gap-3 pb-3">
          <Status>Active</Status><ArrowRight className="size-6 text-teal" /><Status>Updating</Status><ArrowRight className="size-6 text-teal" /><Status>Active</Status>
        </div>
      </div>
      <div className="absolute left-[100px] top-[250px] grid w-[1720px] grid-cols-2 gap-x-10 gap-y-8">
        {FLOW.map((f, i) => (
          <div key={f.step} className="flex flex-col gap-4">
            <Shot src={screen(f.src)} crop={f.crop} width={840} alt={f.title}>
              {f.marks.map(m => <Marker key={m.n} {...m} />)}
            </Shot>
            <div className="flex items-baseline gap-3">
              <Badge className="rounded-full bg-navy px-3 py-0.5 text-[17px]">{i + 1} · {f.step}</Badge>
              <span className="text-[22px] font-semibold text-navy">{f.title}</span>
            </div>
            <span className="-mt-2 text-[19px] text-muted-foreground">{f.text}</span>
          </div>
        ))}
      </div>
    </Slide>
  )
}

/* ---------------------------------------------------------------- 8 Split billing */
export function SplitBilling() {
  return (
    <Slide>
      <div className="absolute left-[100px] top-[70px] w-[1180px]">
        <Head eyebrow="07 · Design decision 1" title="Make split billing understandable." lead="Financial allocation is a comprehension problem before it becomes a control problem." />
      </div>

      <div className="absolute left-[100px] top-[300px]">
        <Shot src={screen("11-split-modal-error-client")} crop={{ x: 360, y: 230, w: 1200, h: 620 }} width={1100} alt="Edit split billing dialog with a 110% total and an inline error">
          <Highlight box={{ x: 1066, y: 706, w: 45, h: 26 }} />
          <Marker n={1} x={1000} y={482} />
          <Marker n={2} x={1460} y={482} />
          <Marker n={3} x={1110} y={760} />
          <Marker n={4} x={1300} y={426} />
          <Marker n={5} x={636} y={530} />
        </Shot>
        <Caption className="mt-4">Client view · a 60/35/15 split, caught before save</Caption>
      </div>

      <div className="absolute right-[100px] top-[300px] flex w-[560px] flex-col gap-7">
        <Point n={1} title="Allocate by % or by licences">ELC (estimated licence count) matches how admins think about seats; billing still uses %.</Point>
        <Point n={2} title="Money beside the input">SPxM and SPxY per buyer update as you type, so the consequence is visible.</Point>
        <Point n={3} title="Totals that check themselves">110% turns red, and the alert states the rule: total must equal 100%.</Point>
        <Point n={4} title="Say when it takes effect">Changes apply from the next billing cycle, stated before saving.</Point>
        <Point n={5} title="Owner stays anchored">The owning buyer is labelled, so nobody loses track of the agreement holder.</Point>
      </div>
    </Slide>
  )
}

/* ---------------------------------------------------------------- 9 Item price */
export function ItemPrice() {
  return (
    <Slide tone="white">
      <div className="absolute left-[100px] top-[70px] w-[1100px]">
        <Head eyebrow="08 · Design decision 2" title="Keep price edits explainable." lead="A price change should never leave anyone unsure what changed, or what it did to margin." />
      </div>

      <div className="absolute left-[100px] top-[330px]">
        <Shot src={screen("21-price-modal-ops-markup12")} crop={{ x: 644, y: 181, w: 632, h: 719 }} width={560} alt="Edit item price dialog for Operations with markup set to 12%">
          <Marker n={1} x={646} y={525} />
          <Marker n={2} x={1250} y={537} />
          <Marker n={3} x={1250} y={705} />
          <Marker n={4} x={646} y={409} />
        </Shot>
        <Caption className="mt-4">Operations view · markup 5% → 12%</Caption>
      </div>

      <div className="absolute left-[730px] top-[350px] flex w-[480px] flex-col gap-7">
        <Point n={1} title="Choose what you’re setting">Purchase price, markup, margin or unit SP. They’re linked, so one is the input.</Point>
        <Point n={2} title="One editable field at a time">The others are disabled, which removes circular edits.</Point>
        <Point n={3} title="The rest follow live">Markup 12% shows margin 10.71% and unit SP 112.00 before saving.</Point>
        <Point n={4} title="Current value beside the new one">Every card keeps today’s figure on the left for comparison.</Point>
      </div>

      <div className="absolute right-[100px] top-[330px] flex w-[540px] flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Shot src={screen("25-price-modal-vendor")} crop={{ x: 644, y: 355, w: 632, h: 371 }} width={540} alt="Vendor version of Edit item price with only the purchase price" />
          <Caption>Vendor view: the same dialog, purchase price only.</Caption>
        </div>
        <Card className="rounded-2xl border-0 bg-navy text-white shadow-none">
          <CardContent className="flex flex-col gap-4 p-8">
            <Eyebrow dark>The trade-off</Eyebrow>
            <div className="text-[22px] leading-snug"><span className="text-white/60">Constraint · </span>no inline-edit architecture for this journey.</div>
            <div className="text-[22px] leading-snug"><span className="text-white/60">Choice · </span>reuse the existing dialog pattern from the entitlements row’s Edit action.</div>
            <div className="text-[22px] leading-snug"><span className="text-white/60">Principle · </span>clarity over an elegant-but-unbuildable interaction.</div>
          </CardContent>
        </Card>
      </div>
    </Slide>
  )
}

/* ---------------------------------------------------------------- 10 Exceptions */
export function Exceptions() {
  return (
    <Slide>
      <div className="absolute left-[100px] top-[70px] w-[1100px]">
        <Head eyebrow="09 · Design decision 3" title="Treat exceptions as primary UX." lead="A disabled action without an explanation is a dead end." />
      </div>

      <div className="absolute left-[100px] top-[310px]">
        <Shot src={screen("53-select-items-mismatch")} crop={{ x: 260, y: 45, w: 1400, h: 530 }} width={1080} alt="Select items dialog showing an item already in the subscription and a billing model mismatch alert">
          <Highlight box={{ x: 285, y: 394, w: 1351, h: 55 }} dashed />
          <Marker n={1} x={264} y={165} />
          <Marker n={2} x={264} y={421} />
          <Marker n={3} x={264} y={531} />
        </Shot>
        <Caption className="mt-4">Vendor view · Edit subscription → Add item → Select items</Caption>
      </div>

      <div className="absolute left-[100px] top-[820px] grid w-[1080px] grid-cols-3 gap-8">
        <Point n={1} title="The rule, in the object’s language">Same billing model and terms, naming both.</Point>
        <Point n={2} title="Already in this subscription">Shown checked and locked, not hidden.</Point>
        <Point n={3} title="Mismatch explains itself">Dimmed rows still respond, with the reason.</Point>
      </div>

      <div className="absolute right-[100px] top-[310px] flex w-[560px] flex-col gap-5">
        <Shot src={screen("31-change-items-reduce-error")} crop={{ x: 324, y: 360, w: 900, h: 240 }} width={560} alt="Quantity reduction blocked until renewal">
          <Marker n={4} x={1222} y={404} />
        </Shot>
        <Point n={4} title="Blocked, with a date">“You can only reduce … at renewal (14 Apr 2027).”</Point>
        <Separator className="my-2" />
        <Shot src={screen("61-status-terminating-menu")} crop={{ x: 1620, y: 80, w: 300, h: 260 }} width={300} alt="Disabled actions on a terminating subscription">
          <Marker n={5} x={1672} y={300} />
        </Shot>
        <Point n={5} title="State-aware actions">Terminate greys out while a termination is already in flight.</Point>
      </div>
    </Slide>
  )
}

/* ---------------------------------------------------------------- 11 Three views */
const VIEWS: { who: string; src: string; owns: string; line: string; hl: Box[] }[] = [
  { who: "Client", src: "03-detail-entitlements-client", owns: "Sell price · SPx", line: "What they pay, for the subscription and every item. One primary action, Edit.", hl: [{ x: 1096, y: 182, w: 150, h: 76 }] },
  { who: "Vendor", src: "03-detail-entitlements-vendor", owns: "Purchase price · PPx", line: "Their own purchase price, never the client’s sell price. Item-level edit from the table.", hl: [] },
  { who: "Operations", src: "03-detail-entitlements-ops", owns: "PPx → yield → SPx", line: "Both sides of the deal, average and default yield, and split billing.", hl: [{ x: 1262, y: 184, w: 202, h: 72 }, { x: 1157, y: 452, w: 297, h: 37 }] },
]
export function ThreeViews() {
  return (
    <Slide tone="white">
      <div className="absolute left-[100px] top-[70px] w-[1720px]">
        <Eyebrow>10 · Visual craft</Eyebrow>
        <h1 className="mt-4 text-[56px] font-bold leading-tight tracking-[-0.02em]">Same subscription. Three views. One shared model.</h1>
      </div>
      <div className="absolute left-[100px] top-[230px] flex w-[1720px] flex-col gap-6">
        {VIEWS.map(v => (
          <div key={v.who} className="flex items-center gap-10">
            <div className="flex w-[560px] flex-col gap-3">
              <div className="flex items-center gap-4">
                <span className="text-[34px] font-bold text-navy">{v.who}</span>
                <Badge variant="secondary" className="rounded-md px-3 py-1 text-[18px] font-semibold">{v.owns}</Badge>
              </div>
              <p className="text-[21px] leading-snug text-muted-foreground">{v.line}</p>
            </div>
            <Shot src={screen(v.src)} crop={{ x: 24, y: 164, w: 1872, h: 440 }} width={1110} alt={`${v.who} entitlements view`}>
              {v.hl.map((b, i) => <Highlight key={i} box={b} pad={4} />)}
            </Shot>
          </div>
        ))}
      </div>
    </Slide>
  )
}

/* ---------------------------------------------------------------- 12 Object page anatomy */
const ANAT = [
  ["A", "Summary of the subscription and its current state"],
  ["B", "One clearly prioritised primary action"],
  ["C", "Secondary actions, with destructive ones last"],
  ["D", "Status and ownership in context"],
  ["E", "Tabs for commercial, operational and historical detail"],
]
export function Anatomy() {
  return (
    <Slide>
      <div className="absolute left-[100px] top-[70px] w-[1240px]">
        <Head eyebrow="11 · Visual craft" title="One structure for every object page." />
      </div>
      <div className="absolute left-[100px] top-[230px] flex flex-col gap-8">
        <Shot src={screen("02-detail-general-client")} crop={{ x: 0, y: 80, w: 1920, h: 300 }} width={1240} alt="Subscription object page, client view">
          <Marker n="A" x={6} y={220} dark />
          <Marker n="B" x={1735} y={110} dark />
          <Marker n="C" x={1875} y={150} dark />
          <Marker n="D" x={398} y={118} dark />
          <Marker n="E" x={6} y={330} dark />
        </Shot>
        <div className="flex flex-col gap-3">
          <Shot src={screen("01-list-client")} crop={{ x: 24, y: 176, w: 1872, h: 640 }} width={1240} alt="Client subscription list with status column">
            <Highlight box={{ x: 1750, y: 232, w: 125, h: 590 }} pad={2} />
          </Shot>
          <Caption>Client subscription list. Status reads as a signal: what’s in flight, what has ended.</Caption>
        </div>
      </div>
      <div className="absolute right-[100px] top-[230px] flex w-[420px] flex-col gap-6">
        {ANAT.map(([k, t]) => <Point key={k} n={k} title={t} />)}
        <Separator className="my-2" />
        {[
          ["Active", "Steady", "Running normally. Nothing needs you."],
          ["Updating", "In transition", "A change is in flight. Check before acting."],
          ["Expired", "Ended", "No longer running. History stays visible."],
        ].map(([s, g, d]) => (
          <div key={s} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3"><Status>{s}</Status><span className="text-[19px] font-semibold text-navy">{g}</span></div>
            <span className="text-[18px] text-muted-foreground">{d}</span>
          </div>
        ))}
      </div>
    </Slide>
  )
}

