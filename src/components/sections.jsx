import { useEffect, useRef, useState } from 'react'
import { projects } from '../data/projects.js'
import { sendMessage } from '../services/contact.js'
import { downloadResume } from '../services/resume.js'
import {
  ArrowRight,
  ArrowUpRight,
  ArrowRightSm,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  GitHub,
  GitHubIcon,
  LinkedIn,
  Mail,
  MapPin,
  Moon,
  projectIcons,
  Sun,
  Wifi,
} from './shared.jsx'

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function Navbar({ isDark, setIsDark }) {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
      const sections = document.querySelectorAll('section[id]')
      let current = ''
      sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id })
      setActiveSection(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    setMobileOpen(false)
    scrollToId(id)
  }

  const navItems = ['hero', 'about', 'projects', 'skills', 'experience', 'blog', 'contact']
  const navLabels = { hero: 'Home', about: 'About', projects: 'Projects', skills: 'Skills', experience: 'Experience', blog: 'Blog', contact: 'Contact' }

  return (
    <>
      <nav className={scrolled ? 'scrolled' : ''}>
        <div className="nav-inner">
          <a href="#hero" className="nav-logo" onClick={e => { e.preventDefault(); scrollTo('hero') }}>N.</a>
          <ul className="nav-links">
            {navItems.map(id => (
              <li key={id}>
                <a href={`#${id}`} className={activeSection === id ? 'active' : ''}
                  onClick={e => { e.preventDefault(); scrollTo(id) }}>
                  {navLabels[id]}
                </a>
              </li>
            ))}
          </ul>
          <div className="nav-actions">
            <button className="theme-toggle" onClick={() => {
              const newDark = !isDark
              setIsDark(newDark)
              document.documentElement.setAttribute('data-theme', newDark ? 'dark' : 'light')
            }} aria-label="Toggle theme">
              {isDark ? <Moon /> : <Sun />}
            </button>
            <button className="btn-ghost" onClick={downloadResume}>
              Resume <ArrowUpRight />
            </button>
            <a href="#contact" className="btn-accent" onClick={e => { e.preventDefault(); scrollTo('contact') }}>Let's talk</a>
            <button className="hamburger" onClick={() => setMobileOpen(open => !open)} aria-label="Menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-nav${mobileOpen ? ' open' : ''}`}>
        <button className="mobile-close" onClick={() => setMobileOpen(false)}>✕</button>
        {navItems.map(id => (
          <a key={id} href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id) }}>{navLabels[id]}</a>
        ))}
      </div>
    </>
  )
}

export function Hero() {
  return (
    <section id="hero">
      <div className="hero-bg">
        <div className="hero-grid" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
      </div>
      <div className="hero-content">
        <p className="hero-name">Hi, i'm Summie</p>
        <h1 className="hero-role">
          Software<br /><em>Engineer</em>
        </h1>
        <p className="hero-value-prop">
          I'm a software engineer focused on backend systems: the APIs, services, and infrastructure that products run on. Over the past few years I've built real-time platforms, distributed job schedulers, and automation tools, mostly working independently out of Lagos with clients across energy, fintech, and consumer software.
        </p>
        <div className="hero-cta-group">
          <a href="#projects" className="btn-primary"
            onClick={e => { e.preventDefault(); scrollToId('projects') }}>
            View my work <ArrowRight />
          </a>
          <a href="#contact" className="btn-secondary"
            onClick={e => { e.preventDefault(); scrollToId('contact') }}>
            Get in touch
          </a>
        </div>
      </div>
      <div className="hero-scroll-hint">
        <button className="scroll-btn" aria-label="Scroll up"
          onClick={() => window.scrollBy({ top: -window.innerHeight, behavior: 'smooth' })}>↑</button>
        <span className="scroll-label">Explore</span>
        <button className="scroll-btn" aria-label="Scroll down"
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}>↓</button>
      </div>
    </section>
  )
}

export function StatsBar() {
  return (
    <div className="stats-bar reveal">
      <div className="container">
        <div className="stats-inner">
          <div className="stat-item">
            <div className="stat-number" data-count="6">0</div>
            <div className="stat-label">Years Building</div>
          </div>
          <div className="stat-item">
            <div className="stat-number" data-count="12">0</div>
            <div className="stat-label">Projects Shipped</div>
          </div>
          <div className="stat-item">
            <div className="stat-number" data-count="8">0</div>
            <div className="stat-label">Technologies</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">Based in </div>
            <div className="stat-label">Lagos</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function About() {
  return (
    <section id="about" className="section-pad">
      <div className="container">
        <div className="reveal">
          <p className="label">About</p>
          <div className="divider" />
        </div>
        <div className="about-grid" style={{ gridTemplateColumns: '1fr' }}>
          <div className="about-left">
            <div className="reveal">
              <p className="body-lg" style={{ marginTop: 0, maxWidth: 680 }}>
                Backend engineering is mostly invisible. That's the point. I design the infrastructure, APIs, and data layers that let everything else work without thinking about it. I've shipped real-time multiplayer systems, distributed job schedulers, and document processing pipelines, mostly solo, mostly from Lagos.
              </p>
              <p className="body-md" style={{ marginTop: 16, maxWidth: 680 }}>
                I'm drawn to problems where correctness actually matters: race conditions, state consistency under load, APIs that downstream teams can rely on without reading your source code. I write Java and Python primarily, reach for Spring Boot or FastAPI depending on the job, and treat deployment as part of the work, not someone else's problem.
              </p>
            </div>
            <div className="about-cards">
              <div className="about-card reveal reveal-delay-1">
                <div className="about-card-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
                  </svg>
                </div>
                <h4>What I build</h4>
                <p>Backend APIs, real-time services, distributed systems, and automation pipelines.</p>
              </div>
              <div className="about-card reveal reveal-delay-2">
                <div className="about-card-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h4>Beyond the work</h4>
                <p>Mentoring early-career engineers in Nigeria's tech ecosystem. Portfolio builds, job strategy, interview prep.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ projectKey, project, onClick }) {
  const Icon = projectIcons[projectKey]
  const cardRef = useRef(null)
  const hasCoverImage = Boolean(project.coverImage)

  const onMouseMove = e => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    card.style.transform = `perspective(1000px) rotateX(${-(y / rect.height) * 7}deg) rotateY(${(x / rect.width) * 7}deg) translateY(-4px)`
  }
  const onMouseLeave = () => { if (cardRef.current) cardRef.current.style.transform = '' }

  const statusMap = {
    verdikt: { cls: 'status-beta', label: 'Beta' },
    dilamme: { cls: 'status-live', label: 'Live' },
    procurement: { cls: 'status-live', label: 'Live' },
    feasibility: { cls: 'status-archived', label: 'Consulting' },
    portfolio: { cls: 'status-live', label: 'Live' },
  }
  const eyebrows = {
    verdikt: 'Social · Real-time',
    dilamme: 'Infrastructure · Internship build',
    procurement: 'Freelance · Automation',
    feasibility: 'Consulting · Strategy',
    portfolio: 'Mentorship',
  }
  const explores = {
    verdikt: 'Read the case study →',
    dilamme: 'Read the case study →',
    procurement: 'Read the case study →',
    feasibility: 'Read the case study →',
    portfolio: 'View details →',
  }

  return (
    <div className="project-card" ref={cardRef} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} onClick={() => onClick(projectKey)}>
      <div className={`project-cover ${project.gradient}`}>
        {hasCoverImage ? (
          <img className="project-cover-media" src={project.coverImage} alt={`${project.title} cover`} />
        ) : (
          <Icon />
        )}
        <div className="project-cover-overlay" />
        <span className={`project-status ${statusMap[projectKey].cls}`}>{statusMap[projectKey].label}</span>
      </div>
      <div className="project-body">
        <p className="project-eyebrow">{eyebrows[projectKey]}</p>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-summary">{project.summary}</p>
        <div className="project-tags">
          {project.tags.slice(0, 4).map(t => <span className="tag" key={t}>{t}</span>)}
        </div>
        <div className="project-footer">
          <span className="project-explore">{explores[projectKey]}</span>
          <div className="project-links">
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer" className="project-link-btn"
                aria-label="GitHub" onClick={e => e.stopPropagation()}><GitHub /></a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noreferrer" className="project-link-btn"
                aria-label="Live" onClick={e => e.stopPropagation()}><ExternalLink /></a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Projects({ onProjectClick }) {
  const trackRef = useRef(null)
  const isDownRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)
  const draggedRef = useRef(false)

  const onMouseDown = e => {
    isDownRef.current = true; draggedRef.current = false
    startXRef.current = e.pageX - trackRef.current.offsetLeft
    scrollLeftRef.current = trackRef.current.scrollLeft
  }
  const onMouseLeave = () => { isDownRef.current = false }
  const onMouseUp = () => { isDownRef.current = false }
  const onMouseMove = e => {
    if (!isDownRef.current) return
    const x = e.pageX - trackRef.current.offsetLeft
    if (Math.abs(x - startXRef.current) > 5) draggedRef.current = true
    trackRef.current.scrollLeft = scrollLeftRef.current - (x - startXRef.current) * 1.2
  }
  const cardStep = () => {
    const card = trackRef.current?.querySelector('.project-card')
    return card ? card.offsetWidth + 24 : 400
  }

  const handleCardClick = (key) => {
    if (draggedRef.current) { draggedRef.current = false; return }
    onProjectClick(key)
  }

  return (
    <section id="projects">
      <div className="gallery-intro">
        <div className="container">
          <div className="gallery-intro-inner">
            <div className="reveal">
              <p className="label">Projects</p>
              <div className="divider" />
            </div>
            <div className="gallery-controls reveal reveal-delay-2">
              <button className="gallery-nav-btn" aria-label="Previous"
                onClick={() => trackRef.current?.scrollBy({ left: -cardStep(), behavior: 'smooth' })}>
                <ChevronLeft />
              </button>
              <button className="gallery-nav-btn" aria-label="Next"
                onClick={() => trackRef.current?.scrollBy({ left: cardStep(), behavior: 'smooth' })}>
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="gallery-scroll-track" ref={trackRef}
        onMouseDown={onMouseDown} onMouseLeave={onMouseLeave} onMouseUp={onMouseUp} onMouseMove={onMouseMove}>
        {Object.entries(projects).map(([key, project]) => (
          <ProjectCard key={key} projectKey={key} project={project} onClick={handleCardClick} />
        ))}
        <div style={{ flex: '0 0 15px' }} />
      </div>
    </section>
  )
}

export function Skills() {
  const skillGroups = [
    {
      icon: <svg className="icon" viewBox="0 0 24 24"><path d="m18 16 4-4-4-4M6 8l-4 4 4 4M14.5 4l-5 16" /></svg>,
      title: 'Languages', delay: 1,
      pills: ['Java', 'Python', 'TypeScript', 'JavaScript', 'SQL', 'Bash'],
    },
    {
      icon: <svg className="icon" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
      title: 'Backend frameworks', delay: 2,
      pills: ['Spring Boot', 'FastAPI', 'Node.js', 'Express', 'WebSockets'],
    },
    {
      icon: <svg className="icon" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>,
      title: 'Databases', delay: 3,
      pills: ['PostgreSQL', 'MongoDB', 'Redis', 'Supabase'],
    },
    {
      icon: <svg className="icon" viewBox="0 0 24 24"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /></svg>,
      title: 'Cloud & infra', delay: 4,
      pills: ['Railway', 'Supabase', 'Nginx', 'DuckDNS', 'VPS'],
    },
    {
      icon: <svg className="icon" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
      title: 'Frontend', delay: 1,
      pills: ['React', 'TypeScript', 'Vite', 'Zustand'],
    },
    {
      icon: <svg className="icon" viewBox="0 0 24 24"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0H5a2 2 0 0 1-2-2v-4m6 6h10a2 2 0 0 0 2-2v-4"/></svg>,
      title: 'Architecture', delay: 2,
      pills: ['System design', 'Microservices', 'Event-driven', 'Queues'],
    },
  ]
  return (
    <section id="skills" className="section-pad">
      <div className="container">
        <div className="reveal">
          <p className="label">Skills</p>
          <div className="divider" />
        </div>
        <div className="skills-grid">
          {skillGroups.map(g => (
            <div className={`skill-group reveal reveal-delay-${g.delay}`} key={g.title}>
              <div className="skill-group-header">
                <div className="skill-group-icon">{g.icon}</div>
                <span className="skill-group-title">{g.title}</span>
              </div>
              <div className="skill-pills">
                {g.pills.map(p => <span className="skill-pill" key={p}>{p}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Experience() {
  const ArrowSm = () => <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  const items = [
    {
      period: 'Apr 2026 – Jun 2026', badge: 'Internship',
      role: 'Backend Engineer Intern', company: 'HNG Internship',
      desc: 'Engineered scalable backend services using FastAPI, leveraging asynchronous programming, dependency injection, and Pydantic for type-safe API development. Contributed to ClinSight by implementing backend features, secure API endpoints, authentication workflows, and optimized data-access layers for healthcare applications.',
      achievements: [
        'Designed distributed job scheduling systems with DAG-based workflow orchestration, worker execution pipelines, retry mechanisms, exponential backoff, dead-letter queues, and fault-tolerant task processing.',
        'Developed real-time communication services using Server-Sent Events (SSE) and WebSockets, supporting reliable event streaming, client reconnection, and live system updates.',
        'Implemented distributed coordination and concurrency control using Redis, including atomic operations, distributed locking, caching strategies, and worker synchronization.',
        'Built secure authentication and authorization systems using OAuth 2.0, JWT, and RBAC, enforcing API security and access control best practices.',
        'Optimized PostgreSQL and MongoDB performance through schema design, indexing, query optimization, and transactional consistency.',
        'Collaborated in Agile development environments using Git-based workflows, code reviews, issue tracking, CI/CD pipelines, and clean architecture principles to deliver production-ready backend services.',
      ],
      tech: ['FastAPI', 'Redis', 'WebSockets', 'PostgreSQL'],
    },
    {
      period: 'Sep 2025 – Jan 2026', badge: 'Instructor',
      role: 'Web Development Instructor & Full Stack Developer', company: 'Haut Hub Institute',
      desc: 'Delivered practical training in modern software engineering, covering HTML, CSS, JavaScript, TypeScript, React, Next.js, Node.js, Express.js, PostgreSQL, and RESTful API development. Architected and developed production-oriented full-stack applications, integrating Next.js frontends with scalable backend services and relational databases.',
      achievements: [
        'Mentored students on software development lifecycle practices, including Git workflows, debugging, testing, API integration, deployment, and collaborative development.',
        'Introduced industry-standard engineering principles such as modular architecture, reusable components, database normalization, authentication, authorization, and performance optimization.',
        'Supervised capstone projects, providing technical guidance on application architecture, backend design, and production deployment.',
      ],
      tech: ['Next.js', 'Node.js', 'Express.js', 'PostgreSQL'],
    },
    {
      period: 'Jan 2025 – Jun 2025', badge: 'Internship',
      role: 'Backend Developer Intern', company: 'Belsoft Systems',
      desc: 'Contributed to the backend development of CashPoint, a fintech platform, implementing RESTful API features, business logic, and secure transaction workflows using Node.js, Express.js, and PostgreSQL. Developed backend modules for BelPower, supporting utility payment and billing services through scalable API integrations, request validation, and database operations.',
      achievements: [
        'Implemented secure authentication and authorization using JWT, middleware-based access control, and Role-Based Access Control (RBAC).',
        'Designed, developed, and documented RESTful APIs, applying consistent error handling, request validation, and API versioning best practices.',
        'Modeled relational databases in PostgreSQL, optimizing schema design, indexing strategies, and SQL queries to improve application performance and data integrity.',
        'Collaborated using Git-based workflows, participating in feature development, debugging, code reviews, and deployment processes.',
      ],
      tech: ['Node.js', 'Express.js', 'PostgreSQL', 'JWT'],
    },
  ]
  return (
    <section id="experience" className="section-pad">
      <div className="container">
        <div className="reveal">
          <p className="label">Experience</p>
          <div className="divider" />
          <h2 className="display-md">Where I've worked</h2>
        </div>
        <div className="timeline">
          {items.map((item, i) => (
            <div className="timeline-item reveal" key={i}>
              <div className="timeline-dot" />
              <div className="timeline-meta">
                <span className="timeline-period">{item.period}</span>
                <span className="timeline-badge">{item.badge}</span>
              </div>
              <h3 className="timeline-role">{item.role}</h3>
              <p className="timeline-company">{item.company}</p>
              <p className="timeline-desc">{item.desc}</p>
              <ul className="timeline-achievements">
                {item.achievements.map((a, j) => (
                  <li key={j}><ArrowSm />{a}</li>
                ))}
              </ul>
              {item.tech.length > 0 && (
                <div className="timeline-tech">
                  {item.tech.map(t => <span className="tag" key={t}>{t}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Blog() {
  return (
    <section id="blog" className="section-pad">
      <div className="container">
        <div className="reveal">
          <p className="label">Writing</p>
          <div className="divider" />
        </div>
        <div className="blog-grid">
          <a href="#" className="blog-card blog-card-featured reveal">
            <div className="blog-featured-cover"><Wifi /></div>
            <div className="blog-featured-left">
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <span className="blog-featured-badge">Featured</span>
                <span className="blog-date">May 2025</span>
              </div>
              <h3 className="blog-featured-title">WebSockets at scale: what I learned building Verdikt's real-time layer</h3>
              <p className="blog-card-excerpt">STOMP over WebSocket sounds simple until you have 50 concurrent sessions and a race condition you can't reproduce locally. Here's how I structured game state server-side and why that decision saved the whole project.</p>
              <div className="blog-card-footer">
                <span>8 min read</span>
                <span className="blog-read-link">Read post →</span>
              </div>
            </div>
          </a>
          {[
            { tag: 'Backend', date: 'Mar 2025', title: 'SSE vs WebSockets: choosing the right real-time primitive', excerpt: "I used both in the same year on different projects. SSE for Dilamme's dashboard, WebSockets for Verdikt. Here's the actual decision framework I use, not the theoretical one.", time: '5 min read' },
            { tag: 'Career', date: 'Feb 2025', title: 'What HNG Stage 9 actually tests (and how to pass it)', excerpt: "Stage 9 isn't about code quality. It's about shipping under pressure. I broke down what the assessors actually look for and the one mistake most engineers make.", time: '6 min read' },
            { tag: 'Nigeria Tech', date: 'Jan 2025', title: 'Building for Nigeria: the stack choices that actually matter', excerpt: 'Paystack over Stripe. Termii for SMS. Railway over AWS for early-stage. A practical guide to Nigerian-compatible infrastructure, with real cost breakdowns.', time: '7 min read' },
          ].map((post, i) => (
            <a href="#" className={`blog-card reveal reveal-delay-${i + 1}`} key={i}>
              <div className="blog-card-meta">
                <span className="blog-tag">{post.tag}</span>
                <span className="blog-date">{post.date}</span>
              </div>
              <h3 className="blog-card-title">{post.title}</h3>
              <p className="blog-card-excerpt">{post.excerpt}</p>
              <div className="blog-card-footer">
                <span>{post.time}</span>
                <span className="blog-read-link">Read →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Contact() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState(null)
  const [feedback, setFeedback] = useState('')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async () => {
    setStatus('sending')
    setFeedback('')
    try {
      await sendMessage(form)
      setStatus('success')
      setFeedback('Message sent! I\'ll get back to you soon.')
      setForm({ firstName: '', lastName: '', email: '', subject: '', message: '' })
    } catch (err) {
      setStatus('error')
      setFeedback(err.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <section id="contact" className="section-pad">
      <div className="contact-bg"><div className="contact-orb" /></div>
      <div className="container contact-inner">
        <div className="contact-heading reveal">
          <p className="label">Contact</p>
          <div className="divider" />
          <h2 className="display-lg">Let's build something</h2>
        </div>

        <div className="contact-grid">
          <a href="mailto:summie777@gmail.com" className="contact-card reveal reveal-delay-1">
            <div className="contact-card-icon"><Mail /></div>
            <div><div className="contact-card-title">Email</div><div className="contact-card-val">summie777@gmail.com</div></div>
            <span className="contact-card-arrow"><ArrowRightSm /></span>
          </a>
          <a href="https://github.com/Summiedev" target="_blank" rel="noreferrer" className="contact-card reveal reveal-delay-2">
            <div className="contact-card-icon"><GitHubIcon /></div>
            <div><div className="contact-card-title">GitHub</div><div className="contact-card-val">@Summiedev</div></div>
            <span className="contact-card-arrow"><ArrowRightSm /></span>
          </a>
          <a href="https://linkedin.com/" target="_blank" rel="noreferrer" className="contact-card reveal reveal-delay-3">
            <div className="contact-card-icon"><LinkedIn /></div>
            <div><div className="contact-card-title">LinkedIn</div><div className="contact-card-val">Connect professionally</div></div>
            <span className="contact-card-arrow"><ArrowRightSm /></span>
          </a>
          <div className="contact-card reveal reveal-delay-4" style={{ cursor: 'default' }}>
            <div className="contact-card-icon"><MapPin /></div>
            <div><div className="contact-card-title">Location</div><div className="contact-card-val">Lagos, Nigeria · Remote-friendly</div></div>
          </div>
        </div>

        <div className="contact-form-wrap reveal">
          <h3 className="display-md" style={{ marginBottom: 24 }}>Send a message</h3>
          <div className="form-row">
            <div className="field">
              <label htmlFor="fname">First name</label>
              <input id="fname" type="text" placeholder="Ada" autoComplete="given-name" value={form.firstName} onChange={set('firstName')} />
            </div>
            <div className="field">
              <label htmlFor="lname">Last name</label>
              <input id="lname" type="text" placeholder="Okafor" autoComplete="family-name" value={form.lastName} onChange={set('lastName')} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="femail">Email address</label>
            <input id="femail" type="email" placeholder="ada@company.com" autoComplete="email" value={form.email} onChange={set('email')} />
          </div>
          <div className="field">
            <label htmlFor="fsubject">Subject</label>
            <input id="fsubject" type="text" placeholder="I have a project in mind..." value={form.subject} onChange={set('subject')} />
          </div>
          <div className="field">
            <label htmlFor="fmessage">Message</label>
            <textarea id="fmessage" rows="5" placeholder="Tell me about your project and what kind of collaboration you're looking for." value={form.message} onChange={set('message')} />
          </div>
          <button className={`submit-btn${status === 'success' ? ' sent' : ''}`}
            onClick={handleSubmit} disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending...' : status === 'success' ? (<><Check /> Message sent!</>) : (<>Send message <ArrowRight /></>)}
          </button>
          {feedback && <div className={`form-feedback ${status}`}>{feedback}</div>}
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  return (
    <footer>
      <div className="container">
        <div className="footer-inner">
          <p className="footer-copy">© 2026 Summie.</p>
          <ul className="footer-links">
            <li><a href="#hero" onClick={e => { e.preventDefault(); scrollTo('hero') }}>Back to top ↑</a></li>
            <li><a href="https://github.com/Summiedev" target="_blank" rel="noreferrer">GitHub</a></li>
            <li><a href="https://linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a></li>
            <li><a href="#" onClick={e => { e.preventDefault(); downloadResume() }}>Resume</a></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export function ProjectModal({ projectKey, onClose }) {
  const project = projects[projectKey]
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKey) }
  }, [onClose])

  if (!project) return null
  const Icon = projectIcons[projectKey]
  const hasCoverImage = Boolean(project.coverImage)

  return (
    <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <div className={`modal-hero ${project.gradient}`}>
          <button className="modal-close" onClick={onClose}>✕</button>
          {hasCoverImage ? (
            <img className="modal-hero-media" src={project.coverImage} alt={`${project.title} cover`} />
          ) : (
            <Icon />
          )}
        </div>
        <div className="modal-header">
          <div className="project-tags">
            {project.tags.map(t => <span className="tag" key={t}>{t}</span>)}
          </div>
          <h2 className="modal-title">{project.title}</h2>
          <p className="body-md">{project.summary}</p>
        </div>
        <div className="modal-body">
          <div className="modal-section">
            <h3>Overview</h3>
            <p>{project.overview}</p>
          </div>
          <div className="modal-section">
            <h3>Key features</h3>
            <div className="modal-features">
              {project.features.map((f, i) => (
                <div className="modal-feature" key={i}><Check />{f}</div>
              ))}
            </div>
          </div>
          <div className="modal-section">
            <h3>Architecture & decisions</h3>
            <p>{project.arch}</p>
          </div>
        </div>
        <div className="modal-actions">
          {project.github && <a href={project.github} target="_blank" rel="noreferrer" className="btn-primary">View on GitHub ↗</a>}
          {project.live && project.live !== '#' && <a href={project.live} target="_blank" rel="noreferrer" className="btn-secondary">Live demo ↗</a>}
        </div>
      </div>
    </div>
  )
}
