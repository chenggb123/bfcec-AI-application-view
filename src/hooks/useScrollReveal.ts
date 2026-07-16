'use client'
import { useEffect, useLayoutEffect, useRef } from 'react'

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null)

  // Phase 1 — BEFORE browser paint: for elements already in the viewport
  // (e.g. after a tab switch, or first load on any device), bypass CSS
  // entirely with inline styles.  No animation, no race — just visible.
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.style.opacity = '1'
      el.style.transform = 'none'
      el.style.animation = 'none'
      el.classList.add('revealed')
    }
  }, [])

  // Phase 2 — AFTER paint: for elements below the fold, use
  // IntersectionObserver to trigger the CSS animation when they
  // scroll into view.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Already handled by Phase 1 — skip observer
    if (el.classList.contains('revealed')) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}
