import { createContext, useContext, type CSSProperties, type ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

/* Every prototype screenshot was captured at a 1920×1080 CSS viewport (2× pixels),
   so crops, markers and highlights are all given in those CSS pixels. */
export type Box = { x: number; y: number; w: number; h: number }
export const FULL: Box = { x: 0, y: 0, w: 1920, h: 1080 }
const VW = 1920
const VH = 1080

export const screen = (name: string) => `./screens/${name}.jpg`

/* ---------- Slide frame ---------- */
export function Slide({
  children,
  tone = "light",
  className,
}: {
  children: ReactNode
  tone?: "light" | "white" | "dark"
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative h-[1080px] w-[1920px] overflow-hidden",
        tone === "light" && "bg-background text-foreground",
        tone === "white" && "bg-white text-foreground",
        tone === "dark" && "bg-navy text-white",
        className
      )}
    >
      {children}
    </div>
  )
}

export function Eyebrow({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <div
      className={cn(
        "text-[22px] font-bold uppercase tracking-[0.08em]",
        dark ? "text-teal-light" : "text-teal"
      )}
    >
      {children}
    </div>
  )
}

export function Title({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h1 className={cn("text-[64px] font-bold leading-[1.05] tracking-[-0.02em] text-balance", className)}>
      {children}
    </h1>
  )
}

export function Lead({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-[28px] leading-[1.4] text-muted-foreground text-pretty", className)}>{children}</p>
}

/* Header block used by most content slides. */
export function Head({
  eyebrow,
  title,
  lead,
  className,
  dark,
}: {
  eyebrow: ReactNode
  title: ReactNode
  lead?: ReactNode
  className?: string
  dark?: boolean
}) {
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
      <Title>{title}</Title>
      {lead ? <Lead className={dark ? "text-white/70" : undefined}>{lead}</Lead> : null}
    </div>
  )
}

/* ---------- Screenshots ---------- */
type ShotCtxValue = { s: number; crop: Box }
const ShotCtx = createContext<ShotCtxValue>({ s: 1, crop: FULL })

/** A real prototype capture, cropped to `crop` and scaled to `width` slide pixels.
 *  Children (Marker, Highlight) are positioned in the capture's own coordinates. */
export function Shot({
  src,
  crop = FULL,
  width,
  className,
  style,
  children,
  chrome = true,
  alt,
}: {
  src: string
  crop?: Box
  width: number
  className?: string
  style?: CSSProperties
  children?: ReactNode
  chrome?: boolean
  alt: string
}) {
  const s = width / crop.w
  return (
    <div className={cn("relative shrink-0", className)} style={{ width, height: crop.h * s, ...style }}>
      <div
        className={cn(
          "absolute inset-0 overflow-hidden bg-white",
          chrome && "rounded-2xl shadow-[0_30px_60px_-20px_rgba(16,37,58,0.35)] ring-1 ring-[#10253a]/10"
        )}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="absolute max-w-none select-none"
          style={{ width: VW * s, height: VH * s, left: -crop.x * s, top: -crop.y * s }}
        />
      </div>
      <ShotCtx.Provider value={{ s, crop }}>{children}</ShotCtx.Provider>
    </div>
  )
}

const useMap = () => {
  const { s, crop } = useContext(ShotCtx)
  return { s, x: (v: number) => (v - crop.x) * s, y: (v: number) => (v - crop.y) * s }
}

/** Numbered annotation pinned to a point in the capture. */
export function Marker({ n, x, y, dark }: { n: ReactNode; x: number; y: number; dark?: boolean }) {
  const m = useMap()
  return (
    <div
      className={cn(
        "absolute z-20 flex size-[46px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[22px] font-bold shadow-[0_6px_16px_rgba(8,124,144,0.45)] ring-4 ring-white",
        dark ? "bg-navy text-white" : "bg-teal text-white"
      )}
      style={{ left: m.x(x), top: m.y(y) }}
    >
      {n}
    </div>
  )
}

/** Outline drawn around a region of the capture. */
export function Highlight({ box, pad = 6, dashed }: { box: Box; pad?: number; dashed?: boolean }) {
  const m = useMap()
  return (
    <div
      className={cn(
        "pointer-events-none absolute z-10 rounded-lg border-[3px] border-teal",
        dashed && "border-dashed"
      )}
      style={{
        left: m.x(box.x) - pad,
        top: m.y(box.y) - pad,
        width: box.w * m.s + pad * 2,
        height: box.h * m.s + pad * 2,
      }}
    />
  )
}

/* ---------- Annotation list ---------- */
export function Point({
  n,
  title,
  children,
  dark,
}: {
  n: ReactNode
  title: ReactNode
  children?: ReactNode
  dark?: boolean
}) {
  return (
    <div className="flex gap-5">
      <div
        className={cn(
          "flex size-[44px] shrink-0 items-center justify-center rounded-full text-[21px] font-bold",
          dark ? "bg-teal-light text-navy" : "bg-teal text-white"
        )}
      >
        {n}
      </div>
      <div className="flex flex-col gap-1.5 pt-1">
        <div className={cn("text-[25px] font-semibold leading-tight", dark ? "text-white" : "text-navy")}>{title}</div>
        {children ? (
          <div className={cn("text-[21px] leading-[1.45]", dark ? "text-white/70" : "text-muted-foreground")}>
            {children}
          </div>
        ) : null}
      </div>
    </div>
  )
}

/* ---------- Status chips, matching the prototype's chip colours ---------- */
const STATUS: Record<string, string> = {
  Active: "bg-[#e6f9f2] text-[#00784d] border-transparent",
  Updating: "bg-[#ebf0ff] text-[#2447b3] border-transparent",
  Terminating: "bg-[#fce8ea] text-[#bb1425] border-transparent",
  Terminated: "bg-[#fce8ea] text-[#bb1425] border-transparent",
  Expired: "bg-[#fce8ea] text-[#bb1425] border-transparent",
}
export function Status({ children, className }: { children: string; className?: string }) {
  return (
    <Badge variant="outline" className={cn("rounded-md px-3 py-1 text-[20px] font-medium", STATUS[children], className)}>
      {children}
    </Badge>
  )
}

/* Small caption label used under screenshots. */
export function Caption({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("text-[18px] font-medium text-muted-foreground", className)}>{children}</div>
}
