/* Colours only, safe for the public bundle (the speaker-notes renderer uses these).
   Descriptions live in evidence.ts, which only the private revision page imports. */
export const EVIDENCE_TONE: Record<string, { tone: string; soft: string }> = {
  Quantitative: { tone: "bg-[#2447b3] text-white", soft: "bg-[#ebf0ff] text-[#2447b3]" },
  Qualitative: { tone: "bg-[#7a3fb0] text-white", soft: "bg-[#f3eafb] text-[#5d2a8c]" },
  "Domain discovery": { tone: "bg-[#087c90] text-white", soft: "bg-[#ddeef2] text-[#0b4f5c]" },
  "Technical constraint": { tone: "bg-[#a15d26] text-white", soft: "bg-[#fdf0e2] text-[#7a4a12]" },
  "Design judgement": { tone: "bg-[#10253a] text-white", soft: "bg-[#e8eff3] text-[#10253a]" },
}
