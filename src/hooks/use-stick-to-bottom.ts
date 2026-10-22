import { useCallback, useEffect, useRef } from 'react'

const THRESHOLD = 80 // px from the bottom that still counts as "at the bottom"

// Keeps a scrollable list pinned to its bottom while new content arrives, unless the
// user scrolled up to read. Pass whatever changes when there is new content (the messages).
//
//   const { ref, onScroll, jumpToEnd } = useStickToBottom<HTMLUListElement>(messages)
//
// Call jumpToEnd() after the user sends something: their own message always scrolls into view.
export function useStickToBottom<T extends HTMLElement>(trigger: unknown) {
  const ref = useRef<T>(null)
  const stick = useRef(true) // true: follow new content

  const scrollToEnd = useCallback(() => {
    const el = ref.current
    if (el) el.scrollTop = el.scrollHeight
  }, [])

  // The user's scrolling decides whether we keep following. Programmatic scrolls to the
  // end also land here and keep it true.
  const onScroll = useCallback(() => {
    const el = ref.current
    if (el) stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < THRESHOLD
  }, [])

  // New content: follow only if the user was at the bottom. The flag comes from the last
  // scroll event, not from measuring now, because new content has already grown the list.
  useEffect(() => {
    if (stick.current) scrollToEnd()
  }, [trigger, scrollToEnd])

  // The list itself changed size (notice line, window resize, a hidden view shown again):
  // keep following if we were.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(() => {
      if (stick.current) scrollToEnd()
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [scrollToEnd])

  const jumpToEnd = useCallback(() => {
    stick.current = true
    scrollToEnd()
  }, [scrollToEnd])

  return { ref, onScroll, jumpToEnd }
}