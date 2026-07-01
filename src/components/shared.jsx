import { useEffect } from 'react'

export const ArrowRight = () => (
  <svg className="icon" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
)
export const ArrowUpRight = () => (
  <svg className="icon" viewBox="0 0 24 24"><path d="M7 17 17 7M17 7H8M17 7v9"/></svg>
)
export const Moon = () => (
  <svg className="icon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
)
export const Sun = () => (
  <svg className="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
)
export const Check = () => (
  <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>
)
export const ChevronLeft = () => (
  <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
)
export const ChevronRight = () => (
  <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
)
export const GitHub = () => (
  <svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
)
export const ExternalLink = () => (
  <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/></svg>
)
export const Mail = () => (
  <svg className="icon" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></svg>
)
export const GitHubIcon = () => (
  <svg className="icon" viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
)
export const LinkedIn = () => (
  <svg className="icon" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
)
export const MapPin = () => (
  <svg className="icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
)
export const ArrowRightSm = () => (
  <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
)
export const Wifi = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/>
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>
  </svg>
)

export const projectIcons = {
  verdikt: () => <svg className="project-cover-icon" viewBox="0 0 24 24"><path d="M6 12h4m-2-2v4M15 13h.01M18 11h.01"/><rect x="2" y="7" width="20" height="10" rx="3"/></svg>,
  dilamme: () => <svg className="project-cover-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  procurement: () => <svg className="project-cover-icon" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/></svg>,
  feasibility: () => <svg className="project-cover-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  portfolio: () => <svg className="project-cover-icon" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
}

export function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view') }),
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

export function useCountUp() {
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return
        const el = e.target
        const target = parseInt(el.dataset.count)
        if (!target) return
        let current = 0
        const inc = target / 40
        const timer = setInterval(() => {
          current += inc
          if (current >= target) { el.textContent = target + '+'; clearInterval(timer) }
          else el.textContent = Math.floor(current)
        }, 30)
        observer.unobserve(el)
      })
    }, { threshold: 0.5 })
    document.querySelectorAll('[data-count]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

export function useCursor() {
  useEffect(() => {
    const cursor = document.getElementById('cursor')
    const ring = document.getElementById('cursor-ring')
    if (!cursor || !ring) return
    let mx = 0, my = 0, rx = 0, ry = 0
    const onMove = e => { mx = e.clientX; my = e.clientY }
    document.addEventListener('mousemove', onMove)
    let raf
    const anim = () => {
      rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15
      cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px'
      raf = requestAnimationFrame(anim)
    }
    raf = requestAnimationFrame(anim)
    const addHover = () => document.body.classList.add('cursor-hover')
    const removeHover = () => document.body.classList.remove('cursor-hover')
    const targets = document.querySelectorAll('a,button,.project-card,.about-card,.contact-card,.skill-pill,.blog-card,.blog-card-featured')
    targets.forEach(el => { el.addEventListener('mouseenter', addHover); el.addEventListener('mouseleave', removeHover) })
    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      targets.forEach(el => { el.removeEventListener('mouseenter', addHover); el.removeEventListener('mouseleave', removeHover) })
    }
  }, [])
}
