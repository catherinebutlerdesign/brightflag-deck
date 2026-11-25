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

/* Speaker notes are the full presenter script. They are compiled out of the hosted
   build (VITE_PUBLIC_BUILD=1, set in the Pages workflow), so they never ship to the
   public site. Run locally to see them.

   How a note line is shown (see NotesBody in deck/Notes.tsx):
   - plain text      → what you say
   - "CUE: …"        → stage direction, not spoken
   - "→ …"           → the line that takes you into the next slide
   - "[…]" anywhere  → a gap only you can fill: your own example, story or decision

   Planned timings add up to 28.5 minutes for the main presentation (20–30 allowed),
   at roughly 130 spoken words a minute. LIVE and appendix slides carry no time. */
export const slides: SlideDef[] = [
  {
    id: "cover", title: "Cover", section: "Intro", minutes: 0.5, Component: Cover,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "Hi, I’m Catherine. Thanks for having me.",
      "I’m going to walk you through self-service subscription management on SoftwareOne’s Marketplace. I worked on it as Senior Product Designer, and it shipped.",
      "What you’re looking at is one subscription, seen three ways: by the customer, by the vendor, and by SoftwareOne’s operations team. That idea, one object with several owners, runs through everything I’m going to show you.",
      "→ Let me start with what a subscription actually was on that platform.",
    ],
  },
  {
    id: "context", title: "Context", section: "01 · Context", minutes: 2, Component: Context,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "CUE: Set up the complexity before showing any screens.",
      "SoftwareOne Marketplace let enterprise customers buy and manage software from many vendors.",
      "A subscription looked like a single thing, but it never stood alone. It sat under an agreement, the commercial contract with the vendor. Orders created it, and later changed it or ended it. It held entitlements: the items, quantities and unit prices. It was billed to one or more buyers, sometimes split between them. And it had a licensee who used it and a seller who sold it.",
      "Each of those records had its own status and its own rules about what you could do with it. So a simple question like “can I add five more seats?” touched the subscription, the agreement, an order, and billing.",
      "My role: I was the Senior Product Designer on the subscription, order and agreement experiences. I mapped the actors, systems and dependencies behind a subscription with subject-matter experts. I designed the list, the object page, the change and termination flows, split billing and item pricing, and later the iPhone version. And I worked closely with Product and Engineering, inside the platform’s existing templates.",
      "→ That connectedness was the root of the problem.",
    ],
  },
  {
    id: "problem", title: "Problem", section: "02 · Problem", minutes: 1.5, Component: Problem,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "Nobody could see the whole subscription.",
      "Pricing, renewals, ownership and operational status were spread across different systems and teams. So customers relied on their account managers to tell them what a subscription meant, who controlled it, and which actions were safe to take.",
      "[Your example: one real moment where a customer needed an account manager to interpret a subscription. Keep it to what you can stand behind; don’t overclaim support numbers.]",
      "Underneath that were three actors who each owned a different number. The client cares about the sell price, what they pay. The vendor owns the purchase price. And operations sits in the middle: purchase price, plus yield, gives sell price.",
      "So the challenge became: let several actors view, request and complete changes without conflicting agreement updates, while making status, ownership and consequences clear.",
      "It mattered because unclear information slows operational decisions, financial edits need confidence and traceability, and exceptions weren’t rare. They were everyday work.",
      "→ Before designing screens, I needed to understand the whole service.",
    ],
  },
  {
    id: "discovery", title: "Discovery", section: "03 · Discovery", minutes: 2, Component: Discovery,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "I built a service blueprint of how one client order becomes a manageable subscription. Five lanes: what the client does, what our UI shows, what the vendor does, and what happens backstage at SoftwareOne and at the vendor. Across five moments, from order placed to the next change.",
      "I worked with subject-matter experts on the lifecycle rules and the agreement constraints, and I defined scenarios for each of the three actors. Later, GA4 data on the live Marketplace helped show where people actually spent their time.",
      "CUE: Point at the Processing column.",
      "The most useful thing the blueprint showed was this column. Almost all the work happens backstage: the vendor reviews items, applies commercial rules, decides whether this is a new subscription or part of an existing one, and activates it. The client sees almost none of that. That gap, between order and subscription, is exactly where ownership and status became unclear.",
      "That turned into a design rule: status has to be explicit, and every state has to say which actions each actor can take.",
      "[Optional: one specific finding from the SME sessions and the decision it led to.]",
      "It also gave Product, Design and Engineering one shared model of the journey, instead of three separate ones.",
      "→ With the system mapped, the next question was what to build first.",
    ],
  },
  {
    id: "scope", title: "Scope", section: "04 · Scope", minutes: 2.5, Component: Scope,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "CUE: The recruiter stressed involvement in defining scope. Slow down here.",
      "Often the most senior design decision is what not to build. We focused version one on four workflows, because that’s where the risk was.",
      "One: a useful object page, so the summary, the current state and the next valid action sit in one place. Two: split billing, so people understand allocation, amounts and totals at the point where they edit them. Three: item-price adjustment, so operations can change pricing and markup without guesswork. And four: clear exception states, so a blocked action explains the rule and the way forward.",
      "We were working within real constraints. The platform had existing collection and object-page templates we needed to reuse. There was technical debt that limited what could change, and when. Inline editing wasn’t supported for these flows, so edits needed another pattern. And every change touched agreements, orders and billing.",
      "[Your scope story: which of these calls you drove, which you proposed, and which you negotiated. Name one thing you deliberately deferred and why. Don’t claim more ownership than you had.]",
      "→ Underneath all four was one idea: design the lifecycle, not just the page.",
    ],
  },
  {
    id: "lifecycle", title: "Lifecycle", section: "05 · Systems", minutes: 2, Component: Lifecycle,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "A subscription can be Active, Updating, Terminating, Terminated or Expired. And the state decides which actions exist for each actor.",
      "Active is the normal case: you can edit, change, set up split billing or terminate. Placing a change order moves it to Updating, and Edit locks until that order completes or fails. If it fails, the subscription goes back to Active, unchanged. Terminating works the same way and ends in Terminated, which is read-only. And if the renewal date passes with auto-renew off, it becomes Expired, but its history stays visible.",
      "Behind every state I asked four questions: what is this object’s state, what can this user do, what rule could block it, and how do we communicate the result?",
      "CUE: Point at the screenshot on the right.",
      "In the interface, that means Edit is disabled, not hidden, and its tooltip explains that only active subscriptions can be edited. The actions menu keeps its shape, with unavailable actions greyed in place, so the page doesn’t shift between states. And the list has a “Needs attention” view that brings Updating, Terminating and Expired together.",
      "→ Here’s what that looks like when someone changes a live subscription.",
    ],
  },
  {
    id: "live-lifecycle", title: "Live · lifecycle", section: "05 · Systems · live", live: true, Component: LiveLifecycle,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "CUE: Optional. Skip with → if you’re over time. Click the steps in the deck window, not here.",
      "This is the prototype itself. From the saved views, “Needs attention” filters to subscriptions in transition or ended.",
      "If I open one that’s Terminating and look at the actions, Edit and Terminate are unavailable, but still there, so it’s clear why.",
      "CUE: Restart reloads clean sample data.",
    ],
  },
  {
    id: "flow", title: "Change flow", section: "06 · Workflow", minutes: 2, Component: ChangeFlow,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "Changes go through one wizard: items, then split billing if the subscription has it, then details, review and a summary.",
      "CUE: Point at marker 1, then 2.",
      "First, the rule lives where the input is. On a committed term you can only reduce quantities at renewal, and the error names the actual date, rather than just going red.",
      "Second, on a split subscription there’s an extra step: who pays for this change? You can bill one buyer, or choose None to follow the split percentages.",
      "Third, the review shows the delta: plus four seats and what that adds to the sell price, not the whole bill again. That’s the number people are deciding on.",
      "And after Place order, the subscription itself says what’s happening. It moves to Updating and Edit locks until the order completes. A second change can’t collide with the first.",
      "→ Split billing came up there. It was one of the hardest pieces to make clear.",
    ],
  },
  {
    id: "live-change", title: "Live · change", section: "06 · Workflow · live", live: true, Component: LiveChange,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "CUE: Optional. Skip with → if you’re over time. Click the steps in the deck window.",
      "Let me reduce this to three. The rule appears straight away, with the renewal date. Now ten instead, and it clears.",
      "Because this subscription is split, I get the split billing step. I’ll bill this order to one buyer.",
      "Review shows just the change. Place order, and the subscription is now Updating, with Edit locked.",
      "CUE: Restart reloads clean sample data.",
    ],
  },
  {
    id: "split", title: "Split billing", section: "07 · Decision 1", minutes: 2, Component: SplitBilling,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "The first design decision: make split billing understandable. Financial allocation is a comprehension problem before it becomes a control problem.",
      "Split billing divides one subscription’s cost between several buyers. On SoftwareOne’s platform it applied to Adobe subscriptions. The client and operations see it; vendors don’t.",
      "CUE: Walk the five markers in order.",
      "One: you can allocate by percentage or by estimated licence count, ELC. ELC matches how admins think about seats, but billing always uses the percentage.",
      "Two: the money sits beside the input. Monthly and yearly sell price per buyer update as you type, so you see the consequence of the number.",
      "Three: the totals check themselves. Here someone typed 35 instead of 25: the total turns red at 110%, and the alert states the rule in plain words. Total allocation must equal 100%.",
      "Four: we say when it takes effect. Changes apply from the next billing cycle, and you read that before you save.",
      "And five: the owning buyer is always labelled, so nobody loses track of who holds the agreement.",
      "[Optional: say exactly which parts you designed and why, if this differed from the shipped version.]",
      "→ Pricing had the same need for clarity, with a different constraint.",
    ],
  },
  {
    id: "live-split", title: "Live · split billing", section: "07 · Decision 1 · live", live: true, Component: LiveSplit,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "CUE: Optional. Skip with → if you’re over time. Click the steps in the deck window.",
      "Here’s the split: 60, 25 and 15. If I change the second buyer to 35, the total goes to 110% and the amounts update.",
      "Save shows the rule instead of failing silently. And I can switch to allocating by licence count.",
      "CUE: Restart reloads clean sample data.",
    ],
  },
  {
    id: "price", title: "Item price", section: "08 · Decision 2", minutes: 2, Component: ItemPrice,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "The second decision: keep price edits explainable. A price change should never leave anyone unsure what changed, or what it did to margin.",
      "Four values are linked: unit purchase price, markup, margin and unit sell price. Change one and the others move. If all four were editable you’d get circular edits.",
      "CUE: Walk markers 1 to 4.",
      "So you choose which value you’re setting. Only that field is editable. The rest follow live: here, markup from 5% to 12% shows margin 10.71% and unit sell price 112 before anything is saved. And every card keeps today’s value on the left, so you can compare.",
      "The vendor gets the same dialog, but only the purchase price. Same pattern, scoped to the role.",
      "Now the trade-off. Inline editing in the table was the obvious idea, but there was no inline-edit architecture for this journey. So we reused the existing dialog pattern from the row’s Edit action. The principle was clarity over an elegant-but-unbuildable interaction.",
      "[Confirm this matches what happened, and add who you worked through it with in Engineering.]",
      "→ The third decision is about the moments when the answer is no.",
    ],
  },
  {
    id: "live-price", title: "Live · item price", section: "08 · Decision 2 · live", live: true, Component: LivePrice,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "CUE: Optional. Skip with → if you’re over time. Click the steps in the deck window.",
      "As operations, I open the item price. Setting markup to 12% updates margin and unit sell price straight away.",
      "I can work from sell price instead. And an impossible margin, over 100%, is caught with a clear message.",
      "CUE: Restart reloads clean sample data.",
    ],
  },
  {
    id: "exceptions", title: "Exceptions", section: "09 · Decision 3", minutes: 2, Component: Exceptions,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "The third decision: treat exceptions as primary UX. A disabled action without an explanation is a dead end.",
      "I designed for three kinds of no.",
      "“It’s already there.” When a vendor adds items, Adobe Dimension is already in this subscription. It’s shown checked and locked, and labelled “Already in this subscription”. We don’t hide it, because then people wonder where it went.",
      "“It doesn’t fit.” Every item in a subscription must share the same billing model and terms. Dimmed rows still respond: click one and the alert explains the rule in the object’s own language, naming both sides. This subscription is quantity, yearly; Adobe Animate is usage, monthly.",
      "“Not yet.” Reducing a committed quantity is blocked, with the date it becomes possible.",
      "And actions follow state: Terminate greys out while a termination is already in flight.",
      "→ Those rules also depend on who’s looking.",
    ],
  },
  {
    id: "live-exceptions", title: "Live · exceptions", section: "09 · Decision 3 · live", live: true, Component: LiveExceptions,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "CUE: Optional. Skip with → if you’re over time. Click the steps in the deck window.",
      "As the vendor, I edit the subscription and add items. Adobe Dimension is already here, checked and locked.",
      "If I pick a usage-billed item, it doesn’t just refuse. It tells me why, naming both billing models.",
      "CUE: Restart reloads clean sample data.",
    ],
  },
  {
    id: "views", title: "Three views", section: "10 · Visual craft", minutes: 2, Component: ThreeViews,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "This is the same Creative Cloud subscription, on the same tab, for each role.",
      "The client sees what they pay: the sell price for the subscription and every item, with one primary action, Edit.",
      "The vendor sees their own purchase price, never the client’s sell price, and can edit items from the table.",
      "Operations sees both sides of the deal: purchase price, average and default yield, and sell price, plus split billing.",
      "CUE: Point at the highlighted fields.",
      "The page structure is identical, so when a client and a vendor talk about this subscription, they’re talking about the same object. But each role sees only the numbers it owns and the actions it’s allowed. That’s what stops changes colliding with someone else’s side of the agreement.",
      "→ That consistency came from one page structure used everywhere.",
    ],
  },
  {
    id: "live-views", title: "Live · three roles", section: "10 · Visual craft · live", live: true, Component: LiveViews,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "CUE: Optional. Skip with → if you’re over time. Click the steps in the deck window.",
      "Same subscription, same tab. Switching to vendor swaps the sell price for the purchase price. Operations adds yield and the sell price. Back to the client.",
      "CUE: Restart reloads clean sample data.",
    ],
  },
  {
    id: "anatomy", title: "Object page", section: "11 · Visual craft", minutes: 2, Component: Anatomy,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "The marketplace used reusable templates for collection and detail pages, and I applied one object-page structure to every subscription.",
      "CUE: Walk A to E.",
      "A, a summary of the subscription and its state. B, one clearly prioritised primary action. C, secondary actions, with destructive ones like Terminate last. D, status and ownership in context. And E, tabs that separate commercial, operational and historical detail.",
      "That meant people didn’t have to relearn each page, and new marketplace capabilities were easier to slot in.",
      "In the list, status reads as a signal, in three groups: steady, in transition, and ended. You can see what needs you without opening every record.",
      "The same model carried over to the iPhone version on Apple’s iOS 27 components. It’s in the appendix if you’d like to see it.",
      "→ None of this happened in isolation.",
    ],
  },
  {
    id: "collab", title: "Collaboration", section: "12 · Collaboration", minutes: 2, Component: Collaboration,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "Designing a useful experience also means negotiating the feasible one.",
      "With Product, the work was clarifying the most important user problem, agreeing a release boundary and what could wait, and keeping exception handling in scope when it would have been easy to cut.",
      "With Engineering, it was surfacing dependencies and tech debt early, working through alternatives to inline editing, and using the existing templates without losing clarity.",
      "What held it together were shared artefacts: the service blueprint, clickable prototypes for each actor, and four scenarios we tested in every review. Purchasing a subscription, spotting what needs attention, knowing who acts next, and making a change without an agreement conflict. That feedback refined the available actions, the status language and the information hierarchy before implementation.",
      "[Your collaboration story, in three beats: where views differed, the options on the table, and the decision and why. Use a real one. The inline-editing trade-off works only if it happened that way.]",
      "→ So what did it lead to?",
    ],
  },
  {
    id: "outcomes", title: "Outcomes", section: "13 · Outcomes", minutes: 2, Component: Outcomes,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "Google Analytics on the production Marketplace, over 28 days from 16 September to 13 October 2026, showed the four pages I designed (home, agreements, subscriptions and orders) were the four most-viewed pages out of more than 165,000. Together they drew 19.31% of all page views. That’s four pages together, not subscriptions alone.",
      "Home is the hub: the most-viewed page, and people move through it quickly. Agreements, orders and subscriptions are where the work happens, and each holds attention for longer than the site average of 1 minute 57. Agreements is 65% above it.",
      "On the business side, sales teams could demo subscription management on their own, without Product or Engineering in the room. That told us the model, states and ownership rules made sense to people without deep operational knowledge. Customers also completed more workflows themselves, with less reliance on account managers.",
      "To be clear about the limits: engagement time isn’t task success, and feature-level task success wasn’t measured. That’s what I’d change.",
      "[Only mention the ~3,000 active users figure from your earlier deck if you can source it.]",
      "→ Which brings me to what I learned.",
    ],
  },
  {
    id: "reflection", title: "Reflection", section: "14 · Reflection", minutes: 1, Component: Reflection,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "The lasting lesson: make complex business logic understandable at the point of action.",
      "In a multi-actor system, a shared state and ownership model matters more than any single screen. The exception is often the real use case. And financial clarity is part of trust.",
      "If I did it again, I’d measure task outcomes, not just engagement. I’d validate the risky financial edge cases earlier. And I’d hand over a clear lifecycle model alongside the designs.",
      "[Your real mistake: one decision you’d make differently, and what it cost. This lands better than a generic lesson.]",
      "→ And why that matters here.",
    ],
  },
  {
    id: "why", title: "Why Brightflag", section: "15 · Why Brightflag", minutes: 1, Component: WhyBrightflag,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "CUE: Keep it to one connection. The case study is the subject, not Brightflag.",
      "Legal tech has different rules, but the shape is familiar. Agreements, orders and subscriptions become matters, invoices and budgets. Vendor relationships become law firms and legal spend. And billing states, dependencies and exceptions become approval workflows and billing exceptions.",
      "Making that kind of logic clear at the moment someone acts on it is the work I enjoy most.",
      "That’s the case study. Thanks for listening. I’m happy to go deeper into any part of it.",
      "CUE: Stop here. Go to the appendix only if asked.",
    ],
  },
  {
    id: "protos", title: "Live prototypes", section: "Appendix", Component: Prototypes,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "CUE: Only if asked about the prototypes or mobile.",
      "These are interactive prototypes I rebuilt from the Commerce Figma file, on SoftwareOne design system tokens. They’re reconstructions, not production captures, and all names, IDs and amounts are sample data.",
      "The iPhone version uses the same ownership model: each role still sees its own prices and only its allowed actions. Tabs, wizards and menus become patterns iPhone users already know.",
    ],
  },
  {
    id: "live-mobile", title: "Live · iPhone", section: "Appendix · live", live: true, Component: LiveMobile,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "CUE: Free play in the deck window. Role and appearance switch beside the phone.",
      "The list groups what needs attention first. Opening a subscription shows the price that role owns as summary tiles. And the four-step change wizard becomes one sheet: adjust quantities, review the cost, place the order.",
    ],
  },
  {
    id: "discussion", title: "Deep dive prompts", section: "Appendix", Component: Discussion,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "CUE: Your prep for the 15–20 minute discussion. Not part of the talk.",
      "Problems you excluded → slide 5 (scope). [What you deferred and why.]",
      "Your role in shaping scope → slide 5. [Which calls you drove, proposed or negotiated.]",
      "User evidence that changed a decision → slide 4 (blueprint) or the four review scenarios on slide 12. [One concrete example.]",
      "A competing solution you rejected → slide 8: inline editing vs the dialog pattern. [Confirm the details.]",
      "How states mapped to actions → slide 6 (lifecycle) and the LIVE lifecycle slide.",
      "How tech debt changed the interface → slides 5 and 8: templates, no inline editing.",
      "How quality was evaluated → design reviews against the four scenarios; sales demoing it unaided.",
      "What you’d measure after release → task success per flow, not just engagement (slides 13 and 14).",
    ],
  },
  {
    id: "questions", title: "Your questions", section: "Appendix", Component: Questions,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "CUE: For the last 5–10 minutes. Pick the two or three most relevant to what came up.",
      "If they mention AI, ask where it assists versus automates the user’s decision. If scope came up a lot, ask how much ownership designers have over MVP scope.",
    ],
  },
]
