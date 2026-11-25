import { Fragment } from "react"
import { cn } from "@/lib/utils"

/** Renders a slide's script. Plain lines are spoken; "CUE:" lines are stage
 *  directions; "→" lines lead into the next slide; "[…]" marks a gap to fill in. */
export function NotesBody({ notes, size = "lg" }: { notes: string[]; size?: "md" | "lg" }) {
  if (!notes.length) {
    return (
      <p className="text-base text-white/50">
        {import.meta.env.VITE_PUBLIC_BUILD ? "Speaker notes aren’t included in the hosted version. Run the deck locally to see them." : "No notes for this slide."}
      </p>
    )
  }
  const text = size === "lg" ? "text-[22px] leading-[1.55]" : "text-[17px] leading-relaxed"
  return (
    <div className="flex flex-col gap-4">
      {notes.map((n, k) => {
        if (n.startsWith("CUE:")) {
          return (
            <p key={k} className={cn("rounded-md border-l-2 border-white/25 bg-white/5 px-3 py-1.5 italic text-white/55", size === "lg" ? "text-[17px]" : "text-[14px]")}>
              {n.slice(4).trim()}
            </p>
          )
        }
        if (n.startsWith("→")) {
          return <p key={k} className={cn("font-semibold text-[#76cad2]", text)}>{withGaps(n)}</p>
        }
        return <p key={k} className={cn("text-white/90", text)}>{withGaps(n)}</p>
      })}
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
