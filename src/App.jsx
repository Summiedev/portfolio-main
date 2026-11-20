import { useEffect, useState } from 'react'
import { About, Contact, Footer, Header, Hero, Skills, Work, Writing } from './components/sections.jsx'
import { NotFound, ProjectPage, WritingPage } from './components/pages.jsx'
import { work } from './data/siteContent.js'
import { writings } from './data/writings.js'

function useRoute() {
  const [route, setRoute] = useState(() => window.location.pathname)
  useEffect(() => {
    const onNavigate = () => setRoute(window.location.pathname)
    const onClick = event => {
      const link = event.target.closest('a[data-site-link]')
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const destination = new URL(link.href, window.location.href)
      if (destination.origin !== window.location.origin) return
      event.preventDefault()
      const nextUrl = `${destination.pathname}${destination.search}${destination.hash}`
      if (nextUrl !== `${window.location.pathname}${window.location.search}${window.location.hash}`) window.history.pushState({}, '', nextUrl)
      setRoute(destination.pathname)
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (destination.hash) document.getElementById(decodeURIComponent(destination.hash.slice(1)))?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
        else window.scrollTo({ top: 0, behavior: 'instant' })
      }))
    }
    window.addEventListener('popstate', onNavigate)
    document.addEventListener('click', onClick)
    return () => { window.removeEventListener('popstate', onNavigate); document.removeEventListener('click', onClick) }
  }, [])
  return route
}

export default function App() {
  const route = useRoute()
  const project = route.startsWith('/work/') ? work.find(item => item.slug === route.slice(6)) : null
  const writing = route.startsWith('/writing/') ? writings.find(item => item.slug === route.slice(9)) : null

  useEffect(() => {
    const elements = document.querySelectorAll('[data-scroll-reveal]')
    if (!elements.length) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !('IntersectionObserver' in window)) {
      elements.forEach(element => element.setAttribute('data-revealed', 'true'))
      return
    }
    document.documentElement.classList.add('has-scroll-reveals')
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.setAttribute('data-revealed', 'true')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' })
    elements.forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [route])

  useEffect(() => {
    const title = route === '/' ? 'Noorah | Software Engineer' : project ? `${project.title} | Noorah` : writing ? `${writing.title} | Noorah` : 'Page not found | Noorah'
    document.title = title
    const description = project?.description || writing?.teaser || 'Noorah is a Software Engineer in Lagos building apps, APIs and real-time tools.'
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', `https://summie.vercel.app${route}`)
  }, [route, project, writing])

  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <Header route={route} />
    {route === '/' ? <main id="main-content"><Hero /><Work /><About /><Skills /><Writing /><Contact /></main> : project ? <div id="main-content"><ProjectPage project={project} /></div> : writing ? <div id="main-content"><WritingPage writing={writing} /></div> : <div id="main-content"><NotFound /></div>}
    <Footer />
  </>
}
