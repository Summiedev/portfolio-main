import { useEffect, useRef, useState } from 'react'
import { experience, work } from '../data/siteContent.js'
import { writings } from '../data/writings.js'
import { contactEmail, sendMessage } from '../services/contact.js'
import { resumeUrl } from '../services/resume.js'
import { BubbleWorld } from './BubbleWorld.jsx'

export function SiteLink({ href, children, ...props }) {
  return <a href={href} data-site-link="" {...props}>{children}</a>
}

export function Arrow({ diagonal = false }) {
  return <span className="arrow" aria-hidden="true">{diagonal ? '↗' : '→'}</span>
}

export function ProjectImage({ project, className = '', eager = false }) {
  return <img className={className} src={project.image} alt={project.imageAlt} loading={eager ? 'eager' : 'lazy'} decoding="async" width="1600" height="900" onError={event => {
    if (project.imageFallback && !event.currentTarget.dataset.fallbackApplied) {
      event.currentTarget.dataset.fallbackApplied = 'true'
      event.currentTarget.src = project.imageFallback
    }
  }} />
}

export function Header({ route }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')
  const menuButton = useRef(null)
  useEffect(() => {
    setOpen(false)
    if (route !== '/') return
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(item => item.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
      if (visible[0]) setActive(visible[0].target.id)
    }, { rootMargin: '-15% 0px -60% 0px', threshold: [0, .2, .5] })
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [route])
  useEffect(() => {
    if (!open) return
    const close = event => { if (event.key === 'Escape') { setOpen(false); menuButton.current?.focus() } }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [open])
  const items = [['work', 'Work'], ['about', 'About'], ['skills', 'Skills'], ['writing', 'Writing'], ['contact', 'Contact']]
  return <header className="site-header"><nav className="header-inner page-pad" aria-label="Main navigation">
    <SiteLink className="wordmark" href="/" onClick={() => setOpen(false)}>Noorah<span className="wordmark-dot">.</span><span className="sr-only"> Home</span></SiteLink>
    <span className="header-descriptor">Software Engineer<br />Lagos, Nigeria</span>
    <div id="site-menu" className={`header-links${open ? ' is-open' : ''}`}>
      {items.map(([id, label]) => <SiteLink key={id} href={`/#${id}`} aria-current={route === '/' && active === id ? 'location' : undefined} onClick={() => setOpen(false)}>{label}</SiteLink>)}
      <a className="header-resume" href={resumeUrl} target="_blank" rel="noopener noreferrer">Résumé <Arrow diagonal /></a>
    </div>
    <button className="menu-button" ref={menuButton} type="button" aria-expanded={open} aria-controls="site-menu" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(value => !value)}>{open ? 'Close' : 'Menu'}<span aria-hidden="true">{open ? '×' : '+'}</span></button>
  </nav></header>
}

export function Hero() {
  const featured = work.find(project => project.id === 'memora') || work[0]
  return <section id="home" className="hero page-pad">
    <div className="hero-copy">
      <p className="hero-role">Software Engineer <span>Lagos, Nigeria</span></p>
      <h1>Noorah<span className="hero-dot">.</span></h1>
      <p className="hero-intro">I design and build complete digital products, from the interface people use to the systems working underneath.</p>
      <div className="hero-actions"><SiteLink href="/#work" className="action-link action-primary">See my work <Arrow diagonal /></SiteLink><SiteLink href="/#contact" className="action-link">Say hello <Arrow diagonal /></SiteLink></div>
    </div>
    <div className="hero-feature">
      <div className="hero-feature-top"><span>A project I built</span><span>{featured.title}</span></div>
      <SiteLink href={featured.path} className="hero-feature-image" aria-label={`Explore ${featured.title}`}><ProjectImage project={featured} eager /></SiteLink>
      <div className="hero-feature-caption"><div><strong>{featured.title}</strong><p>{featured.line}</p></div><SiteLink href={featured.path} aria-label={`View ${featured.title}`}>↗</SiteLink></div>
    </div>
    <div className="hero-bottom"><span>Software Engineer · Lagos, Nigeria</span><SiteLink href="/#work">Explore projects ↓</SiteLink></div>
  </section>
}

export function Work() {
  return <section id="work" className="work-section page-pad"><div className="work-heading" data-scroll-reveal><div><p className="eyebrow">Selected work</p><h2>Things I’ve built.</h2></div></div>
    <BubbleWorld />
  </section>
}

const aboutNotes = [
  { title: 'What I build', text: 'Complete digital products, with thoughtful interfaces on top and dependable systems underneath.' },
  { title: 'What I pay attention to', text: 'The details people rarely notice: access rules, safe retries, consistent data, and what happens when something goes wrong.' },
  { title: 'What I enjoy sharing', text: 'Turning complicated technical ideas into something practical, clear, and useful for the people around me.' },
]

export function About() {
  const [active, setActive] = useState(0)
  return <section id="about" className="about-section page-pad"><div className="about-title" data-scroll-reveal><p className="eyebrow">About me</p><h2>A bit<br />{' '}about me.</h2></div><div className="about-composition"><div className="about-primary" data-scroll-reveal><span className="about-stamp" aria-hidden="true">N</span><p className="about-lead">I’m Noorah, a Software Engineer in Lagos. I build mobile and web apps, along with the backend services they need.</p><p className="about-detail">I enjoy solving the less visible parts too: keeping data consistent, handling retries, and making live updates recover cleanly. I’ve also taught web development, and I like making technical ideas easier to understand.</p><a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="underlined-link">Read my résumé <Arrow diagonal /></a></div><div className="about-notes" aria-label="More about my work">{aboutNotes.map((note, index) => <div className={`about-note${active === index ? ' is-active' : ''}`} key={note.title} data-scroll-reveal style={{ '--reveal-delay': `${index * 70}ms` }}><button type="button" aria-expanded={active === index} aria-controls={`about-note-${index}`} onClick={() => setActive(active === index ? -1 : index)}><span>{note.title}</span><span aria-hidden="true">{active === index ? '−' : '+'}</span></button><div className="about-note-body" id={`about-note-${index}`} aria-hidden={active !== index}><p>{note.text}</p></div></div>)}</div></div><div className="experience-block"><h3>Where I’ve worked</h3><div className="experience-list">{experience.map((item, index) => <details className="experience-item" key={item.place} data-scroll-reveal="turn" style={{ '--reveal-delay': `${index * 90}ms` }}><summary><span className="experience-period">{item.period}</span><span className="experience-heading"><strong>{item.role}</strong><small>{item.place}</small><span className="experience-overview">{item.summary}</span></span><span className="experience-toggle" aria-hidden="true">+</span></summary><div className="experience-details"><ul>{item.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul><div className="experience-tools" aria-label={`Technologies used at ${item.place}`}>{item.technologies.map(technology => <span key={technology}>{technology}</span>)}</div></div></details>)}</div></div></section>
}

const skillGroups = [
  { name: 'Languages', tone: 'light', items: ['Java', 'Python', 'TypeScript', 'JavaScript', 'SQL', 'Bash', 'Dart'] },
  { name: 'Backend frameworks', tone: 'medium', items: ['Spring Boot', 'FastAPI', 'Node.js', 'Express', 'Socket.io', 'STOMP', 'Celery', 'SQLAlchemy', 'Passport.js', 'node-cron'] },
  { name: 'Databases', tone: 'dark', items: ['PostgreSQL', 'MongoDB', 'MongoDB Atlas', 'Mongoose', 'Redis', 'Supabase'] },
  { name: 'Cloud & infra', tone: 'medium', items: ['Docker', 'Caddy', 'Nginx', 'Vercel', 'Railway', 'DigitalOcean', 'PM2', 'DuckDNS', 'VPS', 'Cloudinary'] },
  { name: 'Frontend', tone: 'light', items: ['React', 'TypeScript', 'Vite', 'HTML/CSS', 'Tailwind CSS', 'Framer Motion', 'TanStack Query', 'Redux Toolkit', 'Leaflet', 'Recharts', 'Flutter'] },
  { name: 'Architecture', tone: 'dark', items: ['System design', 'Microservices', 'Event-driven systems', 'OAuth 2.0', 'JWT', 'Serverless', 'WebSockets', 'Server-Sent Events', 'Queues'] },
]
const skillIcons = {
  Java: 'java', Python: 'python', JavaScript: 'javascript', TypeScript: 'typescript', Dart: 'dart', Bash: 'bash',
  'Spring Boot': 'spring', FastAPI: 'fastapi', Express: 'express', React: 'react', Flutter: 'flutter', 'Tailwind CSS': 'tailwindcss', 'TanStack Query': 'reactquery', 'Redux Toolkit': 'redux',
  'Node.js': 'nodejs', PostgreSQL: 'postgresql', MongoDB: 'mongodb', 'MongoDB Atlas': 'mongodb', Redis: 'redis', SQLAlchemy: 'sqlalchemy', Mongoose: 'mongoose', 'Socket.io': 'socketio', Celery: 'celery',
  Docker: 'docker', Caddy: 'caddy', Nginx: 'nginx', Vercel: 'vercel', Railway: 'railway', DigitalOcean: 'digitalocean', PM2: 'pm2', Cloudinary: 'cloudinary', Supabase: 'supabase',
  Vite: 'vite', 'Framer Motion': 'framer', Leaflet: 'leaflet',
}

export function Skills() {
  const [active, setActive] = useState(0)
  return <section id="skills" className="skills-section page-pad"><div className="skills-head" data-scroll-reveal><p className="eyebrow">Skills</p><h2>What I work with.</h2></div><div className="skill-stack">{skillGroups.map((group, index) => <article className={`skill-layer skill-layer-${group.tone}${active === index ? ' is-active' : ''}`} key={group.name} data-scroll-reveal="stack" style={{ '--reveal-delay': `${index * 65}ms` }}><button id={`skill-toggle-${index}`} type="button" aria-expanded={active === index} aria-controls={`skill-panel-${index}`} onClick={() => setActive(active === index ? -1 : index)}><span>{group.name}</span><span className="skill-layer-action" aria-hidden="true">{active === index ? 'Close −' : 'Open +'}</span></button><div className="skill-layer-body" id={`skill-panel-${index}`} aria-labelledby={`skill-toggle-${index}`} aria-hidden={active !== index}><ul>{group.items.map((item, itemIndex) => <li key={item} style={{ '--skill-stagger': `${itemIndex * 20}ms` }}><span className="skill-symbol" aria-hidden="true"><span>{item.slice(0, 2)}</span>{skillIcons[item] && <img src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${skillIcons[item]}/${skillIcons[item]}-original.svg`} alt="" loading="lazy" width="22" height="22" onError={event => { event.currentTarget.style.display = 'none' }} />}</span>{item}</li>)}</ul></div></article>)}</div></section>
}

export function Writing() {
  const categories = ['All', ...new Set(writings.map(item => item.topic))]
  const [category, setCategory] = useState(() => {
    try {
      const saved = sessionStorage.getItem('noorah-writing-category') || sessionStorage.getItem('summie-writing-category')
      return categories.includes(saved) ? saved : 'All'
    } catch { return 'All' }
  })
  const filtered = category === 'All' ? writings : writings.filter(item => item.topic === category)
  const selectCategory = value => {
    setCategory(value)
    try { sessionStorage.setItem('noorah-writing-category', value) } catch { /* The filter still works without storage. */ }
  }
  return <section id="writing" className="writing-section page-pad"><div className="writing-head" data-scroll-reveal><div><p className="eyebrow">Writing</p><h2>Notes on<br />{' '}what I build.</h2></div><p>Short notes on storage, reliable actions, and live updates.</p></div><div className="writing-categories" data-scroll-reveal role="group" aria-label="Filter writing by topic">{categories.map(value => <button key={value} type="button" className={category === value ? 'is-active' : ''} aria-pressed={category === value} onClick={() => selectCategory(value)}>{value}</button>)}</div><ul className="writing-shelf" data-scroll-reveal="turn" aria-live="polite" aria-label="Writing notes">{filtered.map((item, index) => <li className={`writing-book writing-book-${index % 3}`} key={`${category}-${item.slug}`} style={{ '--book-order': index }}><SiteLink href={`/writing/${item.slug}`} aria-label={`Read note: ${item.title}`}><span className="writing-book-pages" aria-hidden="true" /><span className="writing-book-face"><span className="writing-book-topic">{item.topic}</span><strong>{item.title}</strong><span className="writing-book-teaser">{item.teaser}</span><span className="writing-book-action">Read note <Arrow diagonal /></span></span></SiteLink></li>)}</ul></section>
}

export function Contact() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle')
  const [feedback, setFeedback] = useState('')
  const [copied, setCopied] = useState(false)
  const section = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(entries => { if (entries[0].isIntersecting) { section.current?.classList.add('is-visible'); observer.disconnect() } }, { threshold: .15 })
    if (section.current) observer.observe(section.current)
    return () => observer.disconnect()
  }, [])
  const update = key => event => setForm(current => ({ ...current, [key]: event.target.value }))
  const submit = async event => {
    event.preventDefault()
    setStatus('sending'); setFeedback('')
    try {
      const result = await sendMessage(form)
      setStatus('sent')
      setFeedback(result.via === 'mailto' ? 'Your email app should open with the message ready to send.' : 'Message sent. Thanks for reaching out.')
      if (result.via !== 'mailto') setForm({ firstName: '', lastName: '', email: '', subject: '', message: '' })
    } catch (error) { setStatus('error'); setFeedback(error.message) }
  }
  const copyEmail = async () => { try { await navigator.clipboard.writeText(contactEmail); setCopied(true); window.setTimeout(() => setCopied(false), 2500) } catch { window.location.href = `mailto:${contactEmail}` } }
  return <section id="contact" className="contact-section page-pad" ref={section}><div className="contact-lid" data-scroll-reveal><p className="eyebrow">Contact me</p><h2>Let’s talk.</h2><p>Have a question or a project in mind? Send me a message.</p></div><div className="contact-drawer"><div className="contact-direct"><p>Email me</p><a href={`mailto:${contactEmail}`} className="contact-email">{contactEmail} <Arrow diagonal /></a><button type="button" onClick={copyEmail} className={`copy-email${copied ? ' is-copied' : ''}`}>{copied ? 'Copied to clipboard' : 'Copy email'} <span aria-hidden="true">{copied ? '✓' : '↗'}</span></button><div className="contact-social"><a href="https://github.com/Summiedev" target="_blank" rel="noopener noreferrer">GitHub <Arrow diagonal /></a><a href={resumeUrl} target="_blank" rel="noopener noreferrer">Résumé <Arrow diagonal /></a></div></div><form className="contact-form" onSubmit={submit}><h3>Send a message.</h3><div className="form-pair"><label>First name<input value={form.firstName} onChange={update('firstName')} autoComplete="given-name" required /></label><label>Last name<input value={form.lastName} onChange={update('lastName')} autoComplete="family-name" /></label></div><label>Email<input type="email" value={form.email} onChange={update('email')} autoComplete="email" required /></label><label>Subject<input value={form.subject} onChange={update('subject')} /></label><label>Message<textarea value={form.message} onChange={update('message')} rows="4" required /></label><div className="form-end"><p role="status" className={status === 'error' ? 'form-error' : ''}>{feedback}</p><button type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send message'} <Arrow diagonal /></button></div></form></div></section>
}

export function Footer() {
  return <footer className="site-footer page-pad"><span>Noorah. Built in Lagos.</span><span>© {new Date().getFullYear()}</span><SiteLink href="/#home">Back to top ↑</SiteLink></footer>
}
