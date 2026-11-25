import { Badge } from "@/components/ui/badge"
import { LivePrototype, type Step } from "../deck/Live"
import { FLOWS } from "../deck/flows"
import { Eyebrow, Slide, screen } from "../deck/kit"

function LiveSlide({ eyebrow, title, actor, steps, poster, file, hint }: { eyebrow: string; title: string; actor?: "client" | "vendor" | "ops"; steps?: Step[]; poster: string; file?: string; hint?: string }) {
  return (
    <Slide tone="white">
      <div className="absolute left-[100px] right-[100px] top-[52px] flex items-center gap-5">
        <Badge className="rounded-full bg-teal px-4 py-1 text-[18px] font-semibold tracking-wide">LIVE</Badge>
        <Eyebrow>{eyebrow}</Eyebrow>
      </div>
      <h1 className="absolute left-[100px] top-[96px] text-[46px] font-bold tracking-[-0.02em] text-navy">{title}</h1>
      <div className="absolute left-[100px] top-[178px]">
        <LivePrototype actor={actor} steps={steps} poster={poster} file={file} hint={hint} width={1720} height={steps?.length ? 770 : 830} />
      </div>
    </Slide>
  )
}

export const LiveLifecycle = () => (
  <LiveSlide
    eyebrow="Lifecycle · client"
    title="Status you can act on, in the real prototype."
    actor="client"
    poster={screen("01c-list-needs-attention-client")}
    steps={FLOWS.lifecycle}
  />
)

export const LiveChange = () => (
  <LiveSlide
    eyebrow="Workflow · client"
    title="Change a live subscription."
    actor="client"
    poster={screen("32-change-items-increase")}
    steps={FLOWS.change}
  />
)

export const LiveSplit = () => (
  <LiveSlide
    eyebrow="Decision 1 · split billing · client"
    title="Make split billing understandable."
    actor="client"
    poster={screen("10-split-modal-client")}
    steps={FLOWS.split}
  />
)

export const LivePrice = () => (
  <LiveSlide
    eyebrow="Decision 2 · item price · operations"
    title="Keep price edits explainable."
    actor="ops"
    poster={screen("20-price-modal-ops")}
    steps={FLOWS.price}
  />
)

export const LiveExceptions = () => (
  <LiveSlide
    eyebrow="Decision 3 · exceptions · vendor"
    title="Treat exceptions as primary UX."
    actor="vendor"
    poster={screen("52-select-items-already")}
    steps={FLOWS.exceptions}
  />
)

export const LiveViews = () => (
  <LiveSlide
    eyebrow="Visual craft · three roles"
    title="Same subscription. Switch who’s looking."
    actor="client"
    poster={screen("03-detail-entitlements-ops")}
    steps={FLOWS.views}
  />
)

export const LiveMobile = () => (
  <LiveSlide
    eyebrow="Appendix · iPhone prototype"
    title="The same model on iPhone, built on iOS 27 components."
    file="subscriptions-mobile.html"
    poster={screen("ios-list")}
    hint="Switch role and appearance from the controls beside the phone"
  />
)
