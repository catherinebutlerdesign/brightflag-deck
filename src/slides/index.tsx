import type { ComponentType } from "react"
import { Context, Cover, Discovery, Lifecycle, Problem, Scope } from "./story"
import { Anatomy, ChangeFlow, Exceptions, ItemPrice, SplitBilling, ThreeViews } from "./design"
import { Collaboration, Discussion, Outcomes, Prototypes, Questions, Reflection, WhyBrightflag } from "./close"
import { LiveChange, LiveExceptions, LiveLifecycle, LiveMobile, LivePrice, LiveSplit, LiveViews } from "./live"

export type SlideDef = {
  id: string
  title: string
  section: string
  minutes?: number
  live?: boolean
  notes: string[]
  Component: ComponentType
}

/* Speaker notes are compiled out of the hosted build (VITE_PUBLIC_BUILD=1, set in the
   Pages workflow), so they never ship to the public site. Run locally to see them.

   Planned timings add up to about 26 minutes for the main presentation (20–30 allowed).
   Appendix slides carry no time. Notes marked "From the Figma deck" are your original presenter notes. */
export const slides: SlideDef[] = [
  {
    id: "cover", title: "Cover", section: "Intro", minutes: 0.5, Component: Cover,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "One line on who you are, then straight into the problem.",
      "The three screens are real captures of the prototype: the same subscription as Operations, the vendor and the client see it.",
    ],
  },
  {
    id: "context", title: "Context", section: "01 · Context", minutes: 2, Component: Context,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "From the Figma deck: set up the complexity before showing screens.",
      "Walk the map: the subscription sits between the agreement, the orders that create or change it, its entitlements and who is billed.",
      "Keep role claims to what you did: mapped actors and dependencies, designed list, object page, flows, split billing, pricing, iPhone.",
    ],
  },
  {
    id: "problem", title: "Problem", section: "02 · Problem", minutes: 1.5, Component: Problem,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "From the Figma deck: use a real user example here; do not overclaim unverified support evidence.",
      "Land the challenge statement, then the three actors: each owns a different number. That is where conflicts come from.",
    ],
  },
  {
    id: "discovery", title: "Discovery", section: "03 · Discovery", minutes: 2, Component: Discovery,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "From the Figma deck: connect one specific discovery finding to a design decision.",
      "This is the blueprint from the portfolio (Fig. B): five lanes, five moments, one client order.",
      "Point at the Processing column: most of the work is invisible to the client. That gap is why status had to be explicit.",
    ],
  },
  {
    id: "scope", title: "Scope", section: "04 · Scope", minutes: 2.5, Component: Scope,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "From the Figma deck: say explicitly which scope calls YOU drove, proposed or negotiated. Do not invent ownership.",
      "The recruiter stressed involvement in defining scope. Give one concrete example of a call you pushed for, and what was deferred.",
    ],
  },
  {
    id: "lifecycle", title: "Lifecycle", section: "05 · Systems", minutes: 2, Component: Lifecycle,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "From the Figma deck: the prototype demonstrates five statuses, change and termination flows.",
      "Questions behind every state: what is the object’s state, what can this user do, what rule could block it, how is the result communicated.",
      "A failed change or termination order returns the subscription to Active, unchanged.",
    ],
  },
  {
    id: "live-lifecycle", title: "Live · lifecycle", section: "05 · Systems · live", live: true, Component: LiveLifecycle,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "Optional live demo: skip with → if you’re short on time.",
      "Click the steps in order, or click around yourself. Restart reloads clean sample data.",
      "Show the Needs attention view, then the disabled actions on a Terminating subscription.",
    ],
  },
  {
    id: "flow", title: "Change flow", section: "06 · Workflow", minutes: 2, Component: ChangeFlow,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "One wizard for changes: Items → Split billing (only on split subscriptions) → Details → Review → Summary.",
      "The rule lives where the input is: committed terms can only be reduced at renewal.",
      "After Place order, the subscription itself says Updating and locks Edit. No second change can collide with the first.",
    ],
  },
  {
    id: "live-change", title: "Live · change", section: "06 · Workflow · live", live: true, Component: LiveChange,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "Optional live demo: skip with → if you’re short on time.",
      "Qty 3 shows the renewal rule; Qty 10 clears it. The split billing step only appears on split subscriptions.",
      "Place order turns the subscription to Updating and locks Edit.",
    ],
  },
  {
    id: "split", title: "Split billing", section: "07 · Decision 1", minutes: 2, Component: SplitBilling,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "From the Figma deck: annotate exactly what you designed and why.",
      "Split billing is Adobe-only on SoftwareOne’s platform; client and Operations both see it, vendors don’t.",
      "ELC is indicative; billing always uses the allocation %. Say why both exist.",
    ],
  },
  {
    id: "live-split", title: "Live · split billing", section: "07 · Decision 1 · live", live: true, Component: LiveSplit,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "Optional live demo: skip with → if you’re short on time.",
      "Typing 35% pushes the total to 110%; Save shows the rule. Switch to ELC to show licence counts.",
    ],
  },
  {
    id: "price", title: "Item price", section: "08 · Decision 2", minutes: 2, Component: ItemPrice,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "From the Figma deck: name an alternative and why it lost.",
      "Unit PP, markup, margin and unit SP are linked. Choosing which one you set removes circular edits.",
      "The vendor gets the same dialog with purchase price only: same pattern, role-scoped.",
    ],
  },
  {
    id: "live-price", title: "Live · item price", section: "08 · Decision 2 · live", live: true, Component: LivePrice,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "Optional live demo: skip with → if you’re short on time.",
      "Markup 12% recalculates margin and unit SP live. Margin 120% shows the validation.",
    ],
  },
  {
    id: "exceptions", title: "Exceptions", section: "09 · Decision 3", minutes: 2, Component: Exceptions,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "From the Figma deck: show the real ‘Already in this subscription’ state and the rationale.",
      "Three kinds of ‘no’: already there, wrong billing model or terms, not yet (at renewal). Each explains itself and keeps the user in place.",
    ],
  },
  {
    id: "live-exceptions", title: "Live · exceptions", section: "09 · Decision 3 · live", live: true, Component: LiveExceptions,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "Optional live demo: skip with → if you’re short on time.",
      "Adobe Dimension is already in the subscription: checked and locked. Picking a usage item explains the billing-model rule.",
    ],
  },
  {
    id: "views", title: "Three views", section: "10 · Visual craft", minutes: 2, Component: ThreeViews,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "Same Creative Cloud subscription for all three roles. Each sees the numbers it owns and only the actions it may take.",
      "Highlighted: the client’s SPx, Operations’ yield fields and the PP → yield → SP columns.",
    ],
  },
  {
    id: "live-views", title: "Live · three roles", section: "10 · Visual craft · live", live: true, Component: LiveViews,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "Optional live demo: skip with → if you’re short on time.",
      "Same subscription, same tab: the columns and highlights change with the role.",
    ],
  },
  {
    id: "anatomy", title: "Object page", section: "11 · Visual craft", minutes: 2, Component: Anatomy,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "Reusable object-page structure: people don’t relearn each page, and new marketplace objects slot in.",
      "Status chips use three groups: steady, in transition, ended.",
    ],
  },
  {
    id: "collab", title: "Collaboration", section: "12 · Collaboration", minutes: 2, Component: Collaboration,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "From the Figma deck: tell one concrete collaboration story: differing views → options → decision.",
      "Candidate story: inline editing wasn’t supported, so item pricing reused the dialog pattern with linked fields. Only use it if it matches what happened.",
    ],
  },
  {
    id: "outcomes", title: "Outcomes", section: "13 · Outcomes", minutes: 2, Component: Outcomes,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "From the Figma deck: 19.31% refers to four pages collectively, not subscription usage alone.",
      "Your Figma deck also cited roughly 3,000 active users across Marketplace. Mention it only if you can source it.",
      "Be upfront: feature-specific task success was not quantified.",
    ],
  },
  {
    id: "reflection", title: "Reflection", section: "14 · Reflection", minutes: 1, Component: Reflection,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "From the Figma deck: replace generic learning with a real mistake or decision you’d change.",
    ],
  },
  {
    id: "why", title: "Why Brightflag", section: "15 · Why Brightflag", minutes: 1, Component: WhyBrightflag,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "From the Figma deck: one concise connection. Avoid making Brightflag the subject of the case study.",
      "Then hand over to questions.",
    ],
  },
  {
    id: "protos", title: "Live prototypes", section: "Appendix", Component: Prototypes,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : ["From the Figma deck: identify these as reconstructed prototypes, not original production captures."],
  },
  {
    id: "live-mobile", title: "Live · iPhone", section: "Appendix · live", live: true, Component: LiveMobile,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "Optional live demo: skip with → if you’re short on time.",
      "Free play: list, detail and sheets. Role and appearance switch beside the phone.",
    ],
  },
  {
    id: "discussion", title: "Deep dive prompts", section: "Appendix", Component: Discussion,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : ["From the Figma deck: keep these as your own prompts; not part of the presentation time."],
  },
  {
    id: "questions", title: "Your questions", section: "Appendix", Component: Questions,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : ["From the Figma deck: ask the most relevant 2–3 in the final 5–10 minutes."],
  },
]
