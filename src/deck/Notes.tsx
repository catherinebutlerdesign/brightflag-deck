import { Fragment } from "react"
import { cn } from "@/lib/utils"
import { EVIDENCE_TONE } from "../prep/evidenceTones"

/** Renders a slide's script.
 *  Plain lines are spoken; "{Step} …" lines are spoken and tagged with their place in
 *  the decision story; "CUE:" lines are stage directions; "→" lines lead into the next
 *  slide; "[…]" marks a gap to fill in. "Q:"/"A:" pairs are likely follow-up questions,
 *  gathered after the script under "If they ask". */
export function NotesBody({ notes, size = "lg" }: { notes: string[]; size?: "md" | "lg" }) {
  if (!notes.length) {
    return (
      <p className="text-base text-white/50">
        {import.meta.env.VITE_PUBLIC_BUILD ? "Speaker notes aren’t included in the hosted version. Run the deck locally to see them." : "No notes for this slide."}
      </p>
    )
  }
  const lg = size === "lg"
  const text = lg ? "text-[22px] leading-[1.55]" : "text-[17px] leading-relaxed"
  const script = notes.filter(n => !/^[QA]:/.test(n))
  const qa = notes.filter(n => /^[QA]:/.test(n))

  return (
    <div className="flex flex-col gap-4">
      {script.map((n, k) => {
        if (n.startsWith("CUE:")) {
          return (
            <p key={k} className={cn("rounded-md border-l-2 border-white/25 bg-white/5 px-3 py-1.5 italic text-white/55", lg ? "text-[17px]" : "text-[14px]")}>
              {n.slice(4).trim()}
            </p>
          )
        }
        if (n.startsWith("→")) {
          return <p key={k} className={cn("font-semibold text-[#76cad2]", text)}>{withGaps(n)}</p>
        }
        const step = n.match(/^\{([^}]+)\}\s*/)
        return (
          <p key={k} className={cn("text-white/90", text)}>
            {step ? (
              <span className={cn("mr-2 inline-block -translate-y-[2px] rounded px-1.5 py-0.5 align-middle font-semibold uppercase tracking-[0.08em]", step[1] in EVIDENCE_TONE ? EVIDENCE_TONE[step[1]].tone : "bg-[#087c90]/40 text-[#9fdde3]", lg ? "text-[12px]" : "text-[10px]")}>
                {step[1]}
              </span>
            ) : null}
            {withGaps(step ? n.slice(step[0].length) : n)}
          </p>
        )
      })}

      {qa.length ? (
        <div className={cn("mt-4 flex flex-col gap-3 border-t border-white/10 pt-5")}>
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-200/70">If they ask</div>
          {qa.map((n, k) =>
            n.startsWith("Q:") ? (
              <p key={k} className={cn("mt-2 font-semibold text-amber-100", lg ? "text-[19px]" : "text-[15px]")}>{n.slice(2).trim()}</p>
            ) : (
              <p key={k} className={cn("-mt-1 text-white/70", lg ? "text-[18px] leading-relaxed" : "text-[15px] leading-relaxed")}>{withGaps(n.slice(2).trim())}</p>
            )
          )}
        </div>
      ) : null}
    </div>
  )
}

function withGaps(line: string) {
  return line.split(/(\[[^\]]+\])/g).map((part, i) =>
    part.startsWith("[") ? (
      <mark key={i} className="rounded bg-amber-300/20 px-1 text-amber-200">{part}</mark>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  )
}
