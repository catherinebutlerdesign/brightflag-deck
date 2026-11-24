import { Badge } from "@/components/ui/badge"
import { LivePrototype, type Driver, type Step } from "../deck/Live"
import { Eyebrow, Slide, screen } from "../deck/kit"

const SPLIT = "SUB-7890-1234-5678" // Creative Cloud Split Billing (Adobe, split across three buyers)
const CC = "SUB-2345-6789-1234" // Creative Cloud All Apps Pro (Adobe)
const TERMINATING = "SUB-8901-2345-6789"
const step = (label: string, run: (d: Driver) => Promise<void>): Step => ({ label, run })

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
    steps={[
      step("Saved views", d => d.click("button", /Default view/, "the saved views menu")),
      step("Needs attention", d => d.click("[role=menuitem]", "Needs attention")),
      step("Open a Terminating one", d => d.openSub(TERMINATING)),
      step("More actions", d => d.click("button[aria-label='More actions']")),
    ]}
  />
)

export const LiveChange = () => (
  <LiveSlide
    eyebrow="Workflow · client"
    title="Change a live subscription."
    actor="client"
    poster={screen("32-change-items-increase")}
    steps={[
      step("Open", d => d.openSub(SPLIT)),
      step("Edit", d => d.click(".obj-ribbon button", /^Edit$/)),
      step("Qty 6 → 3", d => d.type("input[aria-label^='New quantity for']", "3", "the quantity field")),
      step("Qty 6 → 10", d => d.type("input[aria-label^='New quantity for']", "10", "the quantity field")),
      step("Next", d => d.click(".wizard-foot button", /^Next$/)),
      step("Bill one buyer", d => d.click(".pick-row", /Stark Industries II(?!I)/, "Stark Industries II")),
      step("Review", async d => { await d.click(".wizard-foot button", /^Next$/); await d.click(".wizard-foot button", /^Next$/) }),
      step("Place order", async d => { await d.click(".wizard-foot button", /^Place order$/); await d.pause(1300) }),
      step("Back to subscription", d => d.click(".wizard-foot button", /^Close$/)),
    ]}
  />
)

export const LiveSplit = () => (
  <LiveSlide
    eyebrow="Decision 1 · split billing · client"
    title="Make split billing understandable."
    actor="client"
    poster={screen("10-split-modal-client")}
    steps={[
      step("Open subscription", d => d.openSub(SPLIT)),
      step("Split billing tab", d => d.tab("Split billing")),
      step("Edit split billing", d => d.click(".tabbar .ribbon-actions button", /^Edit$/)),
      step("Type 35%", d => d.type("input[aria-label='Allocation % for Stark Industries II']", "35", "the allocation field")),
      step("Save", d => d.click("[role=dialog] button", /^Save$/)),
      step("Allocate by ELC", d => d.click("[role=radio]", /ELC/)),
    ]}
  />
)

export const LivePrice = () => (
  <LiveSlide
    eyebrow="Decision 2 · item price · operations"
    title="Keep price edits explainable."
    actor="ops"
    poster={screen("20-price-modal-ops")}
    steps={[
      step("Open subscription", d => d.openSub(SPLIT)),
      step("Entitlements", d => d.tab("Entitlements")),
      step("Edit price", d => d.click("button[aria-label^='Edit price for']")),
      step("Markup 12%", d => d.type("#f-markup", "12", "the markup field")),
      step("Set unit SP", async d => { await d.click("[role=radio][aria-label='Unit SP']"); await d.type("#f-sp", "115", "the unit SP field") }),
      step("Margin 120%", async d => { await d.click("[role=radio][aria-label='Margin']"); await d.type("#f-margin", "120", "the margin field") }),
    ]}
  />
)

export const LiveExceptions = () => (
  <LiveSlide
    eyebrow="Decision 3 · exceptions · vendor"
    title="Treat exceptions as primary UX."
    actor="vendor"
    poster={screen("52-select-items-already")}
    steps={[
      step("Open subscription", d => d.openSub(CC)),
      step("Edit subscription", d => d.click(".obj-ribbon button", /^Edit$/)),
      step("Items", d => d.click(".step-btn", "Items")),
      step("Add item", d => d.click("button", /Add item/)),
      step("Pick a usage item", async d => { await d.click("tr.row-off", /Usage/, "a usage-billed item"); await d.reveal("[role=dialog] .inline-alert", "the billing model alert") }),
    ]}
  />
)

export const LiveViews = () => (
  <LiveSlide
    eyebrow="Visual craft · three roles"
    title="Same subscription. Switch who’s looking."
    actor="client"
    poster={screen("03-detail-entitlements-ops")}
    steps={[
      step("Open as client", d => d.openSub(SPLIT)),
      step("Entitlements", d => d.tab("Entitlements")),
      step("View as vendor", d => d.actor("Vendor")),
      step("View as operations", d => d.actor("Operations")),
      step("Back to client", d => d.actor("Client")),
    ]}
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
