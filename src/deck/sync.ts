import { useCallback, useEffect, useRef } from "react"

/* The deck and the presenter view talk over a BroadcastChannel, which works
   between tabs and windows of the same site, locally and on GitHub Pages. */
export type DeckMsg =
  | { type: "state"; index: number } // deck → presenter: this slide is showing
  | { type: "goto"; index: number } // presenter → deck: show this slide
  | { type: "hello" } // presenter → deck: where are you?

const NAME = "brightflag-deck"

export function useDeckChannel(onMessage: (m: DeckMsg) => void) {
  const chan = useRef<BroadcastChannel | null>(null)
  const handler = useRef(onMessage)
  handler.current = onMessage
  useEffect(() => {
    if (!("BroadcastChannel" in window)) return
    const c = new BroadcastChannel(NAME)
    c.onmessage = e => handler.current(e.data as DeckMsg)
    chan.current = c
    return () => { c.close(); chan.current = null }
  }, [])
  return useCallback((m: DeckMsg) => chan.current?.postMessage(m), [])
}

export const isPresenter = () => new URLSearchParams(location.search).has("presenter")

export function openPresenter(index: number) {
  const url = `${location.pathname}?presenter#/${index + 1}`
  window.open(url, "brightflag-presenter", "popup,width=1400,height=860")
}
