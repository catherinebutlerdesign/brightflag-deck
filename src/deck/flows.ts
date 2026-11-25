import type { Driver, Step } from "./Live"

/* Guided prototype flows, shared by the LIVE slides and the private revision page. */
export const SPLIT = "SUB-7890-1234-5678" // Creative Cloud Split Billing (Adobe, split across three buyers)
export const CC = "SUB-2345-6789-1234" // Creative Cloud All Apps Pro (Adobe)
export const TERMINATING = "SUB-8901-2345-6789"
const step = (label: string, run: (d: Driver) => Promise<void>): Step => ({ label, run })

export const FLOWS = {
  /** Tour of the shared object-page template on a split subscription. */
  objectPage: [
    step("Open subscription", d => d.openSub(SPLIT)),
    step("Highlights", d => d.reveal("main section.card", "the highlights panel")),
    step("Tabs", d => d.reveal(".tabbar [role=tablist]", "the tabs")),
    step("Global Edit", d => d.reveal(".obj-ribbon .ribbon-actions", "the object-level actions")),
    step("Split billing tab", d => d.tab("Split billing")),
    step("Contextual Edit", d => d.reveal(".tabbar .ribbon-actions button", "the tab’s Edit button")),
  ],
  lifecycle: [
    step("Saved views", d => d.click("button", /Default view/, "the saved views menu")),
    step("Needs attention", d => d.click("[role=menuitem]", "Needs attention")),
    step("Open a Terminating one", d => d.openSub(TERMINATING)),
    step("More actions", d => d.click("button[aria-label='More actions']")),
  ],
  change: [
    step("Open", d => d.openSub(SPLIT)),
    step("Edit", d => d.click(".obj-ribbon button", /^Edit$/)),
    step("Qty 6 → 3", d => d.type("input[aria-label^='New quantity for']", "3", "the quantity field")),
    step("Qty 6 → 10", d => d.type("input[aria-label^='New quantity for']", "10", "the quantity field")),
    step("Next", d => d.click(".wizard-foot button", /^Next$/)),
    step("Bill one buyer", d => d.click(".pick-row", /Stark Industries II(?!I)/, "Stark Industries II")),
    step("Review", async d => { await d.click(".wizard-foot button", /^Next$/); await d.click(".wizard-foot button", /^Next$/) }),
    step("Place order", async d => { await d.click(".wizard-foot button", /^Place order$/); await d.pause(1300) }),
    step("Back to subscription", d => d.click(".wizard-foot button", /^Close$/)),
  ],
  split: [
    step("Open subscription", d => d.openSub(SPLIT)),
    step("Split billing tab", d => d.tab("Split billing")),
    step("Edit split billing", d => d.click(".tabbar .ribbon-actions button", /^Edit$/)),
    step("Type 35%", d => d.type("input[aria-label='Allocation % for Stark Industries II']", "35", "the allocation field")),
    step("Save", d => d.click("[role=dialog] button", /^Save$/)),
    step("Allocate by ELC", d => d.click("[role=radio]", /ELC/)),
  ],
  price: [
    step("Open subscription", d => d.openSub(SPLIT)),
    step("Entitlements", d => d.tab("Entitlements")),
    step("Edit price", d => d.click("button[aria-label^='Edit price for']")),
    step("Markup 12%", d => d.type("#f-markup", "12", "the markup field")),
    step("Set unit SP", async d => { await d.click("[role=radio][aria-label='Unit SP']"); await d.type("#f-sp", "115", "the unit SP field") }),
    step("Margin 120%", async d => { await d.click("[role=radio][aria-label='Margin']"); await d.type("#f-margin", "120", "the margin field") }),
  ],
  exceptions: [
    step("Open subscription", d => d.openSub(CC)),
    step("Edit subscription", d => d.click(".obj-ribbon button", /^Edit$/)),
    step("Items", d => d.click(".step-btn", "Items")),
    step("Add item", d => d.click("button", /Add item/)),
    step("Pick a usage item", async d => { await d.click("tr.row-off", /Usage/, "a usage-billed item"); await d.reveal("[role=dialog] .inline-alert", "the billing model alert") }),
  ],
  views: [
    step("Open as client", d => d.openSub(SPLIT)),
    step("Entitlements", d => d.tab("Entitlements")),
    step("View as vendor", d => d.actor("Vendor")),
    step("View as operations", d => d.actor("Operations")),
    step("Back to client", d => d.actor("Client")),
  ],
} satisfies Record<string, Step[]>
