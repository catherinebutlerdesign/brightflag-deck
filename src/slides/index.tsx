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
   - plain text        → what you say
   - "{Evidence} …"    → what you say, tagged with its step in the decision story
                          (Problem, Evidence, Insight, Alternatives, Decision, Trade-off,
                          Validation, Outcome). The tag is a reminder, not spoken.
   - "CUE: …"          → stage direction, not spoken
   - "→ …"             → the line that takes you into the next slide
   - "[…]" anywhere    → a gap only you can fill
   - "Q: …" / "A: …"   → likely interviewer follow-ups and short answers, shown
                          after the script. Not part of the talk.

   Ownership is kept explicit: “I” for your own calls, “the PMs”, “leadership” or
   “we” for decisions you didn’t own.

   Planned timings add up to 24.5 minutes for the main presentation, at roughly
   130 spoken words a minute with room for pauses. LIVE and appendix slides carry
   no time: use them only if you’re ahead. */
export const slides: SlideDef[] = [
  {
    id: "cover", title: "Cover", section: "Intro", minutes: 0.5, Component: Cover,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "Hi, I’m Catherine. Thanks for having me.",
      "I’m going to walk you through self-service subscription management on SoftwareOne’s Marketplace. I was the Senior Product Designer, and it shipped. What you’re looking at is one subscription seen by three people: the customer, the vendor and SoftwareOne’s operations team.",
      "→ Let me start with what the business was trying to do.",
    ],
  },
  {
    id: "context", title: "Context", section: "01 · Context", minutes: 1.5, Component: Context,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "SoftwareOne wanted to digitise its commercial processes and move customers to self-service, so they relied less on internal staff. Managing subscriptions was already a requirement. I didn’t start that initiative.",
      "A subscription never stands alone. It sits under an agreement. Orders create it, change it and end it. It holds entitlements and pricing. And it’s billed to one or more buyers.",
      "I was lead designer for Home, Agreements, Subscriptions and Orders. In the Figma file, I’m the named owner of the platform’s object state-change pattern.",
      "Within that, two things were my own push: an information architecture that brings related actions to the subscription, and a reusable page template the other objects could share.",
      "→ So what was wrong with how it worked before?",
      "Q: Did you own the roadmap?",
      "A: No. The business set the goal and the PMs owned priorities. I influenced what we built through evidence, and I owned how it was structured and designed.",
      "Q: What did lead designer mean day to day?",
      "A: [Your answer: who you worked with by role, and what you signed off.]",
    ],
  },
  {
    id: "problem", title: "Problem", section: "02 · Problem", minutes: 2, Component: Problem,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "The short version: nobody could see the whole subscription.",
      "{Quantitative} The legacy platform was PyraCloud. Heap showed poor funnel conversion in the subscription experience. People started, and didn’t get through.",
      "[If you remember the Heap figures, add one. If not, say you don’t have the exact numbers.]",
      "{Qualitative} Heap told us where. Interviews told us why. Participants kept asking us how to do things, and split billing came up a lot.",
      "{Insight} Split billing existed, but it lived somewhere else, away from the subscription. So it was a discoverability problem caused by fragmented information architecture. And the subscription showed lots of information with no clear structure.",
      "CUE: Point at the three actor cards.",
      "Three actors owned different numbers: the client their sell price, the vendor their purchase price, and operations both, plus yield. Unclear structure meant guessing, or asking an account manager.",
      "→ Here’s how I made sense of it.",
      "Q: Were your decisions informed by usage statistics?",
      "A: For the object page, yes: Heap showed where people dropped off, and interviews showed why. For lifecycle and billing, the evidence was mainly commercial rules and domain discovery. I combined those with design judgement.",
      "Q: How many interviews, and who with?",
      "A: [Your answer: number and type of participants, if you know them. If not, say so plainly.]",
    ],
  },
  {
    id: "discovery", title: "Discovery", section: "03 · Discovery", minutes: 2.5, Component: Discovery,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "CUE: Say once: the blueprint is redrawn from my original; I no longer have the file.",
      "I made sense of it in two ways.",
      "{Synthesis} First, I mapped the commercial objects: subscriptions, agreements, orders, entitlements, split billing, buyers and pricing, and the actions that belong to each. Laid out like that, split billing is clearly part of the subscription. So it should be reachable from the subscription.",
      "That’s close to object-oriented UX thinking: objects and relationships first, screens second. I wouldn’t claim a formal OOUX process.",
      "CUE: Point at the blueprint, then the Processing column.",
      "{Domain discovery} Second, journey mapping: how one order becomes a subscription. Most of the work happens here, in Processing, and the client sees almost none of it. So the subscription needed in-between states, not just Active.",
      "{Decision} Two principles came out of it. Related information and actions live with the subscription. And every state says what each actor can do.",
      "→ That’s also how scope took shape.",
      "Q: Where does GA4 come in?",
      "A: After release, on the new Marketplace. Discovery used Heap on the legacy PyraCloud platform, plus interviews.",
      "Q: Did you follow OOUX?",
      "A: The approach was aligned with it, mapping objects, relationships and actions before screens, but I didn’t follow a formal OOUX methodology.",
    ],
  },
  {
    id: "scope", title: "Scope", section: "04 · Scope", minutes: 2, Component: Scope,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "CUE: Three layers. Keep them separate; this is what Toast pushed on.",
      "I’d separate three things.",
      "{Roadmap influence} The roadmap wasn’t mine. The business set the self-service goal and the PMs set priorities. My part was bringing evidence: Heap showing poor conversion, and interviews showing people couldn’t find split billing.",
      "{Functional scope} Functional scope is what the product had to do, and discovery changed it in three places. Journey mapping showed we needed transitional states. Business rules showed a quantity change is a change order, so it needed review and a summary. And the interviews put split billing inside the subscription.",
      "{Design decisions} Then the design decisions, which were mine: the object map, the reusable template, the hierarchy, the tabs, where actions sit, and the delta column.",
      "All inside real constraints: existing templates, no inline editing for these flows, and commercial data from a legacy back end.",
      "→ The transitional states came straight from that journey map.",
      "Q: Did your recommendations change the roadmap?",
      "A: I can’t claim that. They shaped functional scope, like adding review to the change flow and bringing split billing into the subscription. Roadmap priority stayed with the PMs.",
      "Q: What did you deliberately not build?",
      "A: Two different things. Design approaches I rejected: inline editing, bespoke pages per object, and a simple edit modal. Features left out of the release: [your example. If you don’t have one, say the PMs owned release scope].",
      "Q: Why not inline editing?",
      "A: There was no inline-edit architecture for these journeys, and prices have linked values. A dialog let people see the consequences before saving, using a pattern that already existed.",
      "Q: How did delivery time affect your choices?",
      "A: Reusing patterns that already existed, the ordering flow and the dialog, meant less new UI to design and build. [Only add effort estimates if you have them.]",
    ],
  },
  {
    id: "lifecycle", title: "Lifecycle", section: "05 · Systems", minutes: 1.5, Component: Lifecycle,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "{Domain discovery} Journey mapping and PM discussions showed that orders, agreements and subscriptions depend on each other. While an order is processing, the subscription is in between.",
      "{Decision} So I designed the in-between states, Updating and Terminating, alongside Active, Terminated and Expired. Each state decides what you can do. During a change, Edit locks until the order completes. If it fails, it goes back to Active.",
      "CUE: Point at the screenshot.",
      "Edit is disabled, not hidden, with a tooltip saying why. And the menu keeps its shape.",
      "{Trade-off} More conditional logic. But people know what to expect, and it’s meant to stop conflicting changes.",
      "→ The clearest case of discovery changing a requirement is the change flow.",
      "Q: Where did the lifecycle rules come from?",
      "A: SoftwareOne’s commercial rules and the legacy architecture, worked through with PMs and subject-matter experts. My job was making each state visible and actionable.",
      "Q: Which actions are locked in each state, and who decided?",
      "A: [Confirm from memory. The prototype locks Edit outside Active. Don’t state exact production rules you’re unsure of.]",
      "Q: The docs list Draft and Deleted. Did you design those?",
      "A: [Confirm. The deck shows the five states in my prototype.]",
    ],
  },
  {
    id: "live-lifecycle", title: "Live · lifecycle", section: "05 · Systems · live", live: true, Component: LiveLifecycle,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "CUE: Optional. Skip with → if you’re over time. Click the steps in the deck window, not here.",
      "This is the prototype. “Needs attention” filters to subscriptions in transition or ended. On a Terminating one, Edit and Terminate are unavailable, but still there.",
    ],
  },
  {
    id: "flow", title: "Change flow", section: "06 · Workflow", minutes: 2, Component: ChangeFlow,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "CUE: Your strongest individual example. Slow down.",
      "{Problem} My first design was a simple edit modal: change the number, save.",
      "{Domain discovery} Then I understood the business rules. Changing quantities creates a change order. It’s a commercial transaction, with money attached.",
      "{Decision} So I reused the existing ordering pattern instead: items, then split billing if it applies, details, review and summary. And I added a delta column, so you see plus four, not just the new total.",
      "CUE: Point at markers 1, 4 and 5.",
      "The rule sits at the input: on a committed term you can only reduce at renewal. Review shows what the change costs. After placing it, the subscription says Updating.",
      "{Trade-off} It’s more steps than a modal. But it’s money and a contract, so a review step is worth the friction.",
      "{Validation} Business experts reviewed the workflow.",
      "→ Split billing was where the interviews pointed.",
      "Q: Isn’t a wizard overkill for changing a number?",
      "A: For a setting, yes. But this creates an order with a cost. People should see the consequence before they commit.",
      "Q: Why reuse the ordering pattern?",
      "A: It already handled orders, review and summary. So people meet one way of placing an order, and there’s less new UI to build.",
      "Q: Was the delta column your idea?",
      "A: Yes. [Say what prompted it, if you remember.]",
      "Q: How do you know the friction was worth it?",
      "A: I don’t have completion data. Business experts reviewed it. Next I’d measure completion and drop-off at the review step.",
    ],
  },
  {
    id: "live-change", title: "Live · change", section: "06 · Workflow · live", live: true, Component: LiveChange,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "CUE: Optional. Skip with → if you’re over time. Click the steps in the deck window.",
      "Reduce to three: the renewal rule appears. Ten instead, and it clears. Bill one buyer, review the delta, place the order, and the subscription is Updating.",
    ],
  },
  {
    id: "split", title: "Split billing", section: "07 · Decision 1", minutes: 1.5, Component: SplitBilling,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "{Qualitative} This is the one people kept asking about in interviews, because it lived away from the subscription.",
      "{Decision} So split billing became a tab on the subscription, with its own Edit button. You don’t enter a bigger editing flow to change it.",
      "CUE: Walk the markers quickly.",
      "Allocation is by percentage or by licence count. The money per buyer sits beside the input. It says when changes take effect, and the owning buyer stays labelled.",
      "CUE: Only call the 100% check a SoftwareOne rule if you’re sure. The evidence pack found it only in the October rebuild.",
      "→ Pricing needed the same clarity, with a different constraint.",
      "Q: How did you know split billing was a problem?",
      "A: In interviews, people asked how to do it, and it lived elsewhere in the platform. The tab fixes that discoverability problem.",
      "Q: Why offer licence counts as well as percentages?",
      "A: People think in seats; invoices use percentages. ELC is indicative, and bridges the two. [Confirm why ELC was introduced.]",
    ],
  },
  {
    id: "live-split", title: "Live · split billing", section: "07 · Decision 1 · live", live: true, Component: LiveSplit,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "CUE: Optional. Skip with → if you’re over time. Click the steps in the deck window.",
      "The split is 60, 25, 15. Change the second to 35: 110%, and Save states the rule. You can also allocate by licence count.",
    ],
  },
  {
    id: "price", title: "Item price", section: "08 · Decision 2", minutes: 1.5, Component: ItemPrice,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "{Domain discovery} Purchase price, markup, margin and sell price are linked mathematically. If all four were editable, you’d get circular edits.",
      "{Decision} So you choose which one you’re setting, and the others follow live: markup to 12% shows margin 10.71% and sell price 112 before saving. Today’s value stays beside the new one. The vendor gets the same dialog, with purchase price only.",
      "{Trade-off} Inline editing in the table was the obvious idea, but there was no inline-edit architecture for this journey. So it reuses the existing dialog pattern: clarity over an elegant-but-unbuildable interaction.",
      "[Confirm this matches what happened.]",
      "→ Then the moments when the answer is no.",
      "Q: What research informed pricing?",
      "A: Mostly domain rules: the values depend on each other. I don’t have user research specific to price editing, so I won’t claim any.",
    ],
  },
  {
    id: "live-price", title: "Live · item price", section: "08 · Decision 2 · live", live: true, Component: LivePrice,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "CUE: Optional. Skip with → if you’re over time. Click the steps in the deck window.",
      "Markup to 12% updates margin and sell price straight away. An impossible margin, over 100%, is caught with a clear message.",
    ],
  },
  {
    id: "exceptions", title: "Exceptions", section: "09 · Decision 3", minutes: 1.5, Component: Exceptions,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "A disabled action without an explanation is a dead end, so I designed for three kinds of no.",
      "“It’s already there”: Adobe Dimension is shown checked and locked, labelled “Already in this subscription”, not hidden. “It doesn’t fit”: dimmed rows still respond, and the alert names both billing models. And “not yet”: reducing a committed quantity is blocked, with the date it becomes possible.",
      "The wording follows SoftwareOne’s commercial rules and terminology rather than inventing new labels.",
      "→ Those rules also depend on who’s looking.",
    ],
  },
  {
    id: "live-exceptions", title: "Live · exceptions", section: "09 · Decision 3 · live", live: true, Component: LiveExceptions,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "CUE: Optional. Skip with → if you’re over time. Click the steps in the deck window.",
      "As the vendor adding items, Dimension is already here and locked. Picking a usage item explains the rule instead of refusing.",
    ],
  },
  {
    id: "views", title: "Three views", section: "10 · Visual craft", minutes: 1, Component: ThreeViews,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "Same subscription, same tab, three roles. The client sees their sell price, the vendor their purchase price, and operations both sides with yield.",
      "One structure, so everyone talks about the same object. Only the numbers and actions each role owns change.",
      "→ That consistency comes from one page template.",
    ],
  },
  {
    id: "live-views", title: "Live · three roles", section: "10 · Visual craft · live", live: true, Component: LiveViews,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "CUE: Optional. Skip with → if you’re over time. Click the steps in the deck window.",
      "Same subscription and tab: vendor, then operations, then back to client. The structure holds; the numbers change.",
    ],
  },
  {
    id: "anatomy", title: "Object page", section: "11 · Visual craft", minutes: 2.5, Component: Anatomy,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "CUE: This is the decision Toast pushed on. Use the markers.",
      "{Problem} PyraCloud showed lots of subscription information with no clear structure, and related actions lived elsewhere.",
      "{Alternative} My first instinct was a bespoke subscription page. But the object map showed orders, agreements and subscriptions needed the same things: a summary, a state, actions and related records.",
      "{Decision} So I created one reusable object-page template, on my own initiative, and applied it to all three.",
      "CUE: Point at A, B and E.",
      "The PMs decided which commercial fields go in the highlights, A. I designed the hierarchy. Edit, B, sits top right for changes to the whole subscription. Related records go in tabs, E, and area-specific actions live in their tab, like split billing.",
      "{Extensibility} The Parameters tab shows why a template matters. Vendors configure what they need to fulfil an order. Ordering parameters are collected during purchase. Fulfilment parameters hold provisioning details: for Adobe, the VIP Marketplace account number, discount tier and order number. Another vendor needs different fields. The tab takes whatever the vendor configures, in the same structure. Configurable data, not fixed screens.",
      "{Trade-off} Less flexibility for any one page. In return: predictable patterns, and faster design work.",
      "{Validation} PMs shaped the content, leadership validated it, and Customer Success gave feedback. Stakeholder review, not usability testing.",
      "{Outcome} It made our work faster, but that’s qualitative. I don’t have a number.",
      "→ Which leads into how we worked together.",
      "Q: Why did you design it this way?",
      "A: Heap showed poor conversion and interviews showed people couldn’t find things like split billing. The object map showed those belonged to the subscription, so the page brings them into its context.",
      "Q: What did the PMs decide, and what did you?",
      "A: The PMs chose the commercial fields in the highlights. I decided how they’re presented, the tab structure, where actions sit, and the shared template.",
      "Q: Did you create the template or apply an existing one?",
      "A: [Be consistent: your portfolio says you applied a consistent structure using the marketplace’s templates. Say which part you created.]",
      "Q: What are parameters?",
      "A: Fields a vendor defines for its product. Ordering parameters are filled in at purchase; fulfilment parameters hold provisioning details, like an Adobe VIP account number. The page shows them without a custom screen per vendor.",
      "Q: Why tabs rather than one long page?",
      "A: To reduce overload while keeping the subscription in view. The highlights carry the essentials, and tabs are named after objects people already know.",
      "Q: Why Edit in the top right?",
      "A: One predictable place for changes to the whole object, on subscriptions, orders and agreements. Area-specific actions live in their tab.",
      "Q: Did you test it with users?",
      "A: Not with formal usability testing. It was validated by PMs, leadership and Customer Success. Now I’d run task-based tests on finding and editing split billing.",
    ],
  },
  {
    id: "collab", title: "Collaboration", section: "12 · Collaboration", minutes: 1.5, Component: Collaboration,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "My clearest collaboration example is the change flow.",
      "{Problem} The ask was simple: let customers change quantities.",
      "{Considerations} Customers wanted a quick change. But business experts helped me see the rules: it’s a change order, with financial consequences.",
      "{Options} A simple edit modal, which I’d designed first. Or the existing ordering pattern, with review and summary.",
      "{Decision} I proposed the ordering pattern, plus a delta column. More steps, but the consequences are visible, and it reuses a pattern the platform already had.",
      "{Outcome} Business experts reviewed the workflow. [Confirm what shipped.]",
      "{Technical constraint} One constraint I learned from the PMs: in Navision, commercial data could be entered and structured differently depending on the commercial process. My job was one consistent customer-facing page despite that.",
      "→ So what did it lead to?",
      "Q: Tell me about a disagreement with Engineering.",
      "A: I don’t have a documented disagreement, so I won’t invent one. [Your real example, if you have one.] What I can describe is how constraints shaped decisions: no inline editing, and variable data from Navision.",
      "Q: How did Navision affect the design?",
      "A: Data and terms could differ by commercial process. I designed one consistent page and used the platform’s terminology, rather than exposing that variation to customers. The integration details were on the engineering side.",
      "Q: Who decided what?",
      "A: PMs set commercial priorities. Leadership validated against business goals. Customer Success gave feedback. I owned the structure, the interaction design and the template.",
    ],
  },
  {
    id: "outcomes", title: "Outcomes", section: "13 · Outcomes", minutes: 1.5, Component: Outcomes,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "CUE: GA4 is from months after launch. Only say the sales line if you can name who told you.",
      "After release, GA4 on the production Marketplace, over 28 days in September and October 2026, showed the four pages I designed were the four most-viewed, with 19.31% of all views between them. Agreements, orders and subscriptions also held attention longer than the site average.",
      "Sales could demo subscription management without Product or Engineering in the room.",
      "{Outcome} To be straight about it: that’s evidence of usage, not proof the funnel Heap showed us improved. There’s no before-and-after. And the template’s speed benefit is qualitative.",
      "→ Which is a big part of what I learned.",
      "Q: How do you know it worked?",
      "A: GA4 shows these pages are heavily used and hold attention. But I can’t show the Heap funnel improved; we didn’t measure the same funnel before and after.",
      "Q: Isn’t longer engagement time a bad sign?",
      "A: It can be. On its own it doesn’t show success. That’s why I’d measure task completion next.",
    ],
  },
  {
    id: "reflection", title: "Reflection", section: "14 · Reflection", minutes: 1, Component: Reflection,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "The lasting lesson: make complex business logic understandable at the point of action, and structure the information around the objects people already think in.",
      "What I’d do differently is measurement. I’d set up task completion, discoverability and navigation effort from the start, and a before-and-after on the same funnel Heap flagged, so I could say whether it improved, not just that it’s used.",
      "→ And why that matters here.",
      "Q: What would you measure first?",
      "A: Can people find and complete split billing from the subscription, and how many steps does it take? Then the conversion of the funnel Heap flagged, compared with the PyraCloud baseline.",
    ],
  },
  {
    id: "why", title: "Why Brightflag", section: "15 · Why Brightflag", minutes: 0.5, Component: WhyBrightflag,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "Legal tech has different rules, but the shape is familiar: matters, invoices and budgets instead of agreements, orders and subscriptions, with approvals and billing exceptions. That’s the work I enjoy most.",
      "That’s the case study. Thanks for listening. I’m happy to go deeper into any part of it.",
      "CUE: Stop here. Go to the appendix only if asked.",
    ],
  },
  {
    id: "protos", title: "Live prototypes", section: "Appendix", Component: Prototypes,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "CUE: Only if asked about the prototypes or mobile.",
      "These are interactive prototypes I rebuilt from the Commerce Figma file, on SoftwareOne design system tokens. They’re reconstructions, not production captures, and the data is sample data.",
      "The iPhone version keeps the same ownership model: each role sees its own prices and only its allowed actions.",
    ],
  },
  {
    id: "live-mobile", title: "Live · iPhone", section: "Appendix · live", live: true, Component: LiveMobile,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "CUE: Free play in the deck window. Role and appearance switch beside the phone.",
      "The list groups what needs attention first. A subscription shows that role’s price as summary tiles, and the change wizard becomes one sheet.",
    ],
  },
  {
    id: "discussion", title: "Deep dive prompts", section: "Appendix", Component: Discussion,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "CUE: Prep for the discussion. Full answers are in each slide’s follow-ups and on the revision page (R).",
      "Roadmap vs scope vs design → slide 5. Roadmap: PMs. Scope: you shaped it with evidence. Design: yours.",
      "Rejected approaches vs excluded features → slide 5. Rejected: inline editing, bespoke pages, simple edit modal. Excluded: [your example].",
      "Strongest individual contribution → slide 8: simple modal became a change order with review, summary and delta.",
      "Collaboration → slide 19: the change-order story, plus the Navision constraint from the PMs.",
      "Evidence types → quantitative (Heap), qualitative (interviews), domain discovery (rules, journey map), technical constraints (no inline editing, Navision), design judgement.",
      "Extensibility → slide 18: Parameters hold vendor-configured fields in one structure.",
      "What you’d measure → task completion, discoverability, navigation effort, before-and-after funnel conversion.",
    ],
  },
  {
    id: "questions", title: "Your questions", section: "Appendix", Component: Questions,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "CUE: For the last 5–10 minutes. Pick the two or three most relevant to what came up.",
      "If they mention AI, ask where it assists versus automates the user’s decision. If scope came up, ask how much ownership designers have over MVP scope.",
    ],
  },
]
