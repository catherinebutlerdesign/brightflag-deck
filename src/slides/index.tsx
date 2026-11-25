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
      "SoftwareOne wanted to digitise its commercial processes and move customers towards self-service, so they relied less on internal staff. Managing subscriptions in the Marketplace was already a requirement when I joined the work. I didn’t originate that initiative.",
      "A subscription looks like one thing, but it never stands alone. It sits under an agreement. Orders create it, change it and end it. It holds entitlements and pricing. And it’s billed to one or more buyers, sometimes split between them.",
      "My part was the design of the subscription, order and agreement experiences. Within that, the two things I identified and pushed myself were the information architecture, so related information and actions sat with the subscription, and a reusable page architecture that the other objects could share.",
      "→ So what was wrong with how it worked before?",
      "Q: Did you set the product direction?",
      "A: No. Self-service was a business objective and subscription management was already a requirement. I owned how it was structured and designed, including the IA changes and the shared page template.",
    ],
  },
  {
    id: "problem", title: "Problem", section: "02 · Problem", minutes: 2, Component: Problem,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "The short version: nobody could see the whole subscription.",
      "{Evidence} The legacy platform was PyraCloud. We used Heap to look at the existing subscription experience, and it showed poor funnel conversion. People were starting, and not getting through.",
      "[If you can recover the actual Heap figures, add one here. If not, don’t estimate: say you don’t have the exact numbers to hand.]",
      "{Evidence} Heap told us where people dropped off, not why. The interviews filled that in. Participants kept using the session to ask us how to do things, and split billing came up a lot.",
      "{Insight} And that made sense once you looked at the platform. Split billing existed, but it lived somewhere else, not with the subscription it applied to. So it was a discoverability problem, caused by fragmented information architecture. On top of that, the subscription showed a lot of information without a clear structure.",
      "CUE: Point at the three actor cards.",
      "It’s also why the stakes were high. Three actors owned different numbers: the client their sell price, the vendor their purchase price, and operations both, plus yield. Unclear structure meant people either guessed or asked an account manager.",
      "→ Here’s how I made sense of what we’d found.",
      "Q: Were your decisions informed by usage statistics?",
      "A: Partly. Heap showed poor funnel conversion in the subscription experience, which told us where the problem was. The interviews told us why, like people not finding split billing. I don’t have the exact funnel numbers to hand, so I won’t quote one.",
      "Q: How many interviews, and who with?",
      "A: [Your answer: number and type of participants, if you know them. If not, say so plainly.]",
    ],
  },
  {
    id: "discovery", title: "Discovery", section: "03 · Discovery", minutes: 2.5, Component: Discovery,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "I synthesised the research in two ways.",
      "{Insight} First, I mapped the commercial objects and how they relate: subscriptions, agreements, orders, entitlements, split billing, buyers and pricing, plus the actions that belong to each. Laid out like that, the answer to the split billing question was obvious. It’s a property of the subscription, so it should be reachable from the subscription, not from a separate area.",
      "That’s close to object-oriented UX thinking: start from the objects and their relationships, then design the screens. I wouldn’t claim I ran a formal OOUX process, but that was the logic.",
      "CUE: Point at the blueprint, then the Processing column.",
      "Second, this service blueprint: how one client order becomes a subscription, across the client, our UI, the vendor and both back stages. Most of the work happens here, in Processing, and the client sees almost none of it. That gap is where ownership and status got unclear.",
      "{Decision} Together, those gave me two design principles. Related information and actions live in the context of the subscription. And every state makes explicit what each actor can do.",
      "→ The next question was what that meant for scope.",
      "Q: The slide lists GA4. Was that part of discovery?",
      "A: No. GA4 was on the new Marketplace after release. Discovery used Heap on PyraCloud, plus interviews.",
      "Q: Did you follow OOUX?",
      "A: The approach was aligned with it, mapping objects, relationships and actions before screens, but I didn’t follow a formal OOUX methodology.",
    ],
  },
  {
    id: "scope", title: "Scope", section: "04 · Scope", minutes: 2, Component: Scope,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "CUE: Toast challenged you on scope. Be precise about who decided what.",
      "Scope came from two directions.",
      "The business and the PMs owned the what. Subscription management was the requirement, and the PMs decided which commercial attributes mattered most.",
      "What I brought into scope was how it was structured. Moving actions like split billing into the subscription’s context. And one page architecture for subscriptions, orders and agreements, instead of designing each one separately.",
      "These four workflows were where the research and the object map pointed: a clear object page, split billing in context, item pricing, and exception states that explain themselves.",
      "And we designed inside real constraints: SoftwareOne’s legacy architecture and commercial rules shaped what information we had and even the terminology. There was technical debt, and no inline editing for these flows.",
      "[Optional: one thing that was deliberately deferred, and why.]",
      "→ The object map also changed how I thought about state.",
      "Q: How was product scope defined?",
      "A: The business set the objective and PMs set commercial priorities. I shaped the structure: I identified the IA problem from research and proposed the reusable object-page template.",
      "Q: What did you push for that wasn’t in the original brief?",
      "A: The shared object-page template, and putting area-specific actions like split billing inside the relevant tab.",
    ],
  },
  {
    id: "lifecycle", title: "Lifecycle", section: "05 · Systems", minutes: 1.5, Component: Lifecycle,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "Once you treat the subscription as an object, its state matters as much as its data. It can be Active, Updating, Terminating, Terminated or Expired, and the state decides which actions exist.",
      "A change order moves it to Updating and locks Edit until the order completes or fails. If it fails, the subscription goes back to Active, unchanged. Terminating ends in Terminated, which is read-only. And if renewal passes with auto-renew off, it’s Expired, with history still visible.",
      "CUE: Point at the screenshot.",
      "In the interface, Edit is disabled rather than hidden, with a tooltip saying why, and the menu keeps its shape. The list also has a “Needs attention” view for anything in transition or ended.",
      "→ Here’s that in a real change.",
      "Q: Where did the lifecycle rules come from?",
      "A: From SoftwareOne’s commercial rules and the legacy architecture, worked through with subject-matter experts. My job was making each state’s rules visible in the interface.",
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
    id: "flow", title: "Change flow", section: "06 · Workflow", minutes: 1.5, Component: ChangeFlow,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "Changes go through one wizard.",
      "CUE: Point at markers 1 to 6 as you go.",
      "The rule lives at the input: on a committed term you can only reduce at renewal, and the error names the date. On a split subscription there’s a step for who pays: one buyer, or None to follow the split. Review shows the delta, plus four seats, not the whole bill. And after placing the order the subscription says Updating and locks Edit, so a second change can’t collide with the first.",
      "→ Split billing was where the research pointed most clearly.",
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
      "{Problem} This is the one people kept asking about in interviews, because it lived away from the subscription.",
      "{Decision} So split billing became a tab on the subscription, with its own Edit button in that tab. You don’t go into a broader editing flow to change it.",
      "CUE: Walk the markers quickly.",
      "Inside the dialog, allocation is by percentage or by licence count. The money per buyer sits beside the input. The total checks itself: 110% turns red and the message states the rule. It says when changes take effect, and the owning buyer stays labelled.",
      "→ Pricing needed the same clarity, with a different constraint.",
      "Q: How did you know split billing was a problem?",
      "A: In interviews, participants asked how to do it, and it lived elsewhere in the platform rather than with the subscription. That’s the discoverability problem the tab fixes.",
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
      "Purchase price, markup, margin and sell price are linked, so if all four were editable you’d get circular edits.",
      "{Decision} You choose which one you’re setting, and the others follow live: markup to 12% shows margin 10.71% and sell price 112 before saving. Today’s value stays beside the new one. The vendor gets the same dialog with purchase price only.",
      "{Trade-off} Inline editing in the table was the obvious idea, but there was no inline-edit architecture for this journey. So it reuses the existing dialog pattern: clarity over an elegant-but-unbuildable interaction.",
      "[Confirm this matches what happened.]",
      "→ Then the moments when the answer is no.",
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
    id: "views", title: "Three views", section: "10 · Visual craft", minutes: 1.5, Component: ThreeViews,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "Same subscription, same tab, three roles. The client sees their sell price. The vendor sees their purchase price, never the client’s. Operations sees both sides, with yield and split billing.",
      "The structure is identical, so client and vendor are talking about the same object. Only the numbers and actions each role owns change. That’s what stops changes colliding.",
      "→ That consistency comes from one page architecture.",
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
      "CUE: This is the decision Toast pushed on. Slow down and use the markers.",
      "{Problem} PyraCloud showed a lot of subscription information with no clear structure, and related actions lived elsewhere.",
      "{Alternatives} My first instinct was a bespoke subscription page. But looking at the object map, orders, agreements and subscriptions all needed the same things: a summary, a state, actions, and related records.",
      "{Decision} So I created one reusable object-page template, on my own initiative, and applied it to all three.",
      "CUE: Point at A and B.",
      "Ownership matters here. The highlights panel, A, holds the attributes the PMs decided were most important commercially. My part was the visual hierarchy: grouping, order and emphasis. Edit, B, sits top right, the one place for changes to the whole subscription, on every object page.",
      "CUE: Point at E.",
      "Related entities go into tabs, E, so you’re not flooded with information but never leave the subscription. And actions that affect one area live in that area’s tab, like split billing, rather than in a big edit flow.",
      "{Trade-off} The cost is less flexibility for any single page. What you get is predictable patterns across the Marketplace, and faster design delivery.",
      "{Validation} The PMs shaped the content, leadership validated it from a business perspective, and Customer Success Managers gave feedback. That was stakeholder review, not usability testing.",
      "{Outcome} The template made our work faster, but that’s my qualitative view. I don’t have a number for it.",
      "→ Which leads into how we worked together.",
      "Q: Why did you design it this way?",
      "A: Heap showed poor conversion, and interviews showed people couldn’t find things like split billing. The object map showed those belonged to the subscription, so the page brings related information and actions into its context.",
      "Q: What did the PMs decide, and what did you?",
      "A: The PMs chose which commercial attributes appear in the highlights. I decided how they’re presented, the tab structure, where actions sit, and the shared template.",
      "Q: Why tabs rather than one long page?",
      "A: To reduce overload while keeping the subscription in view. The risk is hiding things behind tabs, so the highlights carry the essentials and tabs are named after the objects people already know.",
      "Q: Why Edit in the top right?",
      "A: A predictable entry point for changes to the whole object, in the same place on subscriptions, orders and agreements. Area-specific actions live in their tab.",
      "Q: Did the template cause problems anywhere?",
      "A: [Your example of a page that strained the template and how you handled it. If none, say so.]",
      "Q: Did you test it with users?",
      "A: Not with formal usability testing. It was validated by PMs, leadership and Customer Success. Now I’d run task-based tests on finding and editing split billing.",
    ],
  },
  {
    id: "collab", title: "Collaboration", section: "12 · Collaboration", minutes: 1.5, Component: Collaboration,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "Roles were clear. The PMs defined the commercial information priorities. Leadership validated the design against the business goals. Customer Success Managers gave stakeholder feedback. And SoftwareOne’s legacy architecture and commercial rules set what information and terminology we could actually show.",
      "In design reviews I checked each design against four scenarios: purchasing, spotting what needs attention, knowing who acts next, and changing without a conflict. That refined the actions, the status language and the hierarchy before build.",
      "[Optional: one moment where views differed, the options, and what was decided.]",
      "→ So what can we say about the outcome?",
      "Q: How did you handle disagreement with the PMs?",
      "A: [Your real example. If none comes to mind, describe how you separated what the PMs owned, which content, from what you owned, structure and presentation.]",
      "Q: How did legacy constraints shape the design?",
      "A: The legacy architecture and commercial rules decided what data was available and what it was called. I designed with that terminology rather than inventing new labels.",
    ],
  },
  {
    id: "outcomes", title: "Outcomes", section: "13 · Outcomes", minutes: 1.5, Component: Outcomes,
    notes: import.meta.env.VITE_PUBLIC_BUILD ? [] : [
      "After release, GA4 on the production Marketplace, over 28 days in September and October 2026, showed the four pages I designed were the four most-viewed of more than 165,000, and drew 19.31% of all views together. Agreements, orders and subscriptions also held attention for longer than the site average.",
      "Sales could demo subscription management without Product or Engineering in the room.",
      "{Outcome} To be straight about it: that’s evidence of usage, not proof the funnel Heap showed us improved. We don’t have a before-and-after for that. And the template’s speed benefit is qualitative.",
      "→ Which is a big part of what I learned.",
      "Q: How do you know it worked?",
      "A: GA4 shows these pages are heavily used and hold attention, and sales could demo it unaided. But I can’t show the Heap funnel improved; we didn’t measure the same funnel before and after.",
      "Q: Isn’t longer engagement time a bad sign?",
      "A: It can be. On its own it doesn’t tell you if people succeeded. That’s why I’d measure task completion next.",
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
      "CUE: Prep for the 15–20 minute discussion. Not part of the talk. Full answers are in the follow-ups on each slide.",
      "Problems you excluded → slide 5 (scope). [What was deferred and why.]",
      "Your role in shaping scope → slides 2 and 5: the business set the objective, PMs set priorities, you identified the IA problem and created the template.",
      "User evidence that changed a decision → slides 3 and 4: interview questions about split billing led to split billing as a tab with its own Edit.",
      "A competing solution you rejected → slide 18: bespoke subscription pages versus a shared template. Also slide 12: inline editing versus a dialog.",
      "How states mapped to actions → slide 6 (lifecycle).",
      "How tech debt changed the interface → slides 5 and 12: legacy terminology, no inline editing.",
      "How quality was evaluated → stakeholder validation by PMs, leadership and Customer Success, plus scenario reviews. Not formal usability testing.",
      "What you’d measure → slide 21: task completion, discoverability, navigation effort, before-and-after funnel conversion.",
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
