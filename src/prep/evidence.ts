import { EVIDENCE_TONE } from "./evidenceTones"

/* One colour per kind of evidence, shared by the speaker notes and the revision page.
   Private: only the revision page imports this file. */
const WHAT = {
  Quantitative: "Heap funnel data on PyraCloud",
  Qualitative: "User interviews",
  "Domain discovery": "Commercial rules, journey mapping, PMs and business experts",
  "Technical constraint": "No inline editing, templates, Navision data",
  "Design judgement": "Your own call, from the evidence",
} as const
export type EvidenceKind = keyof typeof WHAT
export const EVIDENCE = Object.fromEntries(
  (Object.keys(WHAT) as EvidenceKind[]).map(k => [k, { ...EVIDENCE_TONE[k], what: WHAT[k] }])
) as Record<EvidenceKind, { tone: string; soft: string; what: string }>
