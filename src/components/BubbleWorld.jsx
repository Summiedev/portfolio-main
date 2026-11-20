import { useCallback, useEffect, useRef, useState } from 'react'
import { work } from '../data/siteContent.js'

const desktop = [
  [.13, .25, 210], [.39, .23, 250], [.72, .24, 205],
  [.23, .65, 195], [.53, .68, 225], [.82, .68, 180], [.39, .92, 155],
  [.87, .44, 170],
]
const tablet = [
  [.19, .17, 180], [.61, .19, 205], [.81, .43, 160],
  [.22, .46, 172], [.51, .64, 190], [.78, .82, 158], [.19, .86, 148],
  [.51, .91, 144],
]
const mobile = [
  [.25, .09, 137], [.74, .2, 145], [.25, .34, 133],
  [.74, .47, 138], [.26, .6, 145], [.74, .73, 133], [.28, .88, 130],
  [.72, .84, 132],
]

function getLayout(width, height) {
  const source = width < 600 ? mobile : width < 960 ? tablet : desktop
  return source.map(([x, y, size]) => ({ x: x * width, y: y * height, size: Math.min(size, width < 600 ? width * .45 : size) }))
}

export function BubbleWorld() {
  const featuredWork = work.slice(0, 5)
  const fieldRef = useRef(null)
  const bubbleRefs = useRef([])
  const physics = useRef([])
  const pointer = useRef({ x: -1000, y: -1000, active: false })
  const drag = useRef(null)
  const frame = useRef(0)
  const visible = useRef(false)
  const reset = useRef(false)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [projectDirection, setProjectDirection] = useState(1)
  const [origin, setOrigin] = useState({ x: '50%', y: '50%', r: 0 })
  const [browseOpen, setBrowseOpen] = useState(false)
  const [browsePinned, setBrowsePinned] = useState(false)
  const selectedButton = useRef(null)
  const browseTrigger = useRef(null)
  const suppressBrowseFocus = useRef(false)
  const dialogFocused = useRef(false)
  const reduced = useRef(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => { reduced.current = query.matches }
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  const openProject = useCallback((index, trigger) => {
    const node = trigger || bubbleRefs.current[index]
    const rect = node?.getBoundingClientRect()
    selectedButton.current = trigger || node
    dialogFocused.current = false
    setProjectDirection(1)
    if (rect) setOrigin({ x: `${rect.left + rect.width / 2}px`, y: `${rect.top + rect.height / 2}px`, r: Math.max(rect.width, rect.height) / 2 })
    setSelected(index)
    requestAnimationFrame(() => setRevealed(true))
  }, [])
  const closeProject = useCallback(() => {
    setRevealed(false)
    window.setTimeout(() => { setSelected(null); dialogFocused.current = false; selectedButton.current?.focus() }, reduced.current ? 0 : 370)
  }, [])

  useEffect(() => {
    if (selected === null) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const key = event => {
      if (event.key === 'Escape') closeProject()
      if (event.key === 'ArrowRight') { setProjectDirection(1); setSelected(value => (value + 1) % work.length) }
      if (event.key === 'ArrowLeft') { setProjectDirection(-1); setSelected(value => (value - 1 + work.length) % work.length) }
      if (event.key === 'Tab') {
        const focusable = [...document.querySelectorAll('.project-overlay a, .project-overlay button')]
        const first = focusable[0]
        const last = focusable.at(-1)
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }
    }
    window.addEventListener('keydown', key)
    if (!dialogFocused.current) { document.getElementById('project-close')?.focus(); dialogFocused.current = true }
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', key) }
  }, [selected, closeProject])

  useEffect(() => {
    const field = fieldRef.current
    if (!field) return
    let box = field.getBoundingClientRect()
    const setAnchors = () => {
      box = field.getBoundingClientRect()
      const layout = getLayout(box.width, box.height)
      physics.current = layout.map((target, index) => {
        const old = physics.current[index]
        return { ...target, x: old?.x ?? target.x, y: old?.y ?? target.y, vx: old?.vx ?? 0, vy: old?.vy ?? 0, ax: target.x, ay: target.y, drag: false }
      })
      physics.current.forEach((body, index) => {
        const node = bubbleRefs.current[index]
        if (node) { node.style.width = `${body.size}px`; node.style.height = `${body.size}px` }
      })
    }
    setAnchors()
    const resize = new ResizeObserver(setAnchors)
    resize.observe(field)
    const observer = new IntersectionObserver(entries => {
      visible.current = entries[0].isIntersecting
      if (visible.current) field.classList.add('is-in-view')
      if (visible.current && !frame.current) frame.current = requestAnimationFrame(tick)
      if (!visible.current && frame.current) { cancelAnimationFrame(frame.current); frame.current = 0 }
    }, { rootMargin: '150px' })
    observer.observe(field)
    let last = 0
    const tick = now => {
      frame.current = visible.current ? requestAnimationFrame(tick) : 0
      if (!visible.current) return
      if (now - last < 30) return
      last = now
      const bodies = physics.current
      const motion = !reduced.current
      for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i]
        if (body.drag) continue
        const idleX = motion ? Math.sin(now * .00022 + i * 2.1) * 4 : 0
        const idleY = motion ? Math.cos(now * .00019 + i * 1.7) * 5 : 0
        let fx = (body.ax + idleX - body.x) * (reset.current ? .038 : .016)
        let fy = (body.ay + idleY - body.y) * (reset.current ? .038 : .016)
        if (motion && pointer.current.active) {
          const dx = body.x - pointer.current.x
          const dy = body.y - pointer.current.y
          const distance = Math.hypot(dx, dy) || 1
          const range = body.size / 2 + 110
          if (distance < range) {
            const push = (range - distance) / range * .25
            fx += dx / distance * push
            fy += dy / distance * push
          }
        }
        for (let j = 0; j < bodies.length; j++) {
          if (i === j) continue
          const other = bodies[j]
          const dx = body.x - other.x
          const dy = body.y - other.y
          const distance = Math.hypot(dx, dy) || 1
          const min = (body.size + other.size) * .46 + 10
          if (distance < min) {
            const push = (min - distance) * .0015
            fx += dx / distance * push
            fy += dy / distance * push
          }
        }
        body.vx = (body.vx + fx) * .88
        body.vy = (body.vy + fy) * .88
        body.x += body.vx
        body.y += body.vy
        const margin = body.size / 2 + 5
        body.x = Math.min(Math.max(body.x, margin), box.width - margin)
        body.y = Math.min(Math.max(body.y, margin), box.height - margin)
      }
      if (reset.current && bodies.every(body => Math.hypot(body.x - body.ax, body.y - body.ay) < 3)) reset.current = false
      bodies.forEach((body, index) => {
        const node = bubbleRefs.current[index]
        if (node) node.style.transform = `translate3d(${body.x - body.size / 2}px, ${body.y - body.size / 2}px, 0)`
      })
    }
    return () => { cancelAnimationFrame(frame.current); resize.disconnect(); observer.disconnect() }
  }, [])

  const pointerDown = (event, index) => {
    if (reduced.current || event.button !== 0) return
    const body = physics.current[index]
    if (!body) return
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { index, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, x: body.x, y: body.y, time: performance.now(), moved: false, vx: 0, vy: 0 }
    body.drag = true
    event.currentTarget.classList.add('is-dragging')
  }
  const pointerMove = event => {
    const field = fieldRef.current
    if (!field) return
    const rect = field.getBoundingClientRect()
    pointer.current = { x: event.clientX - rect.left, y: event.clientY - rect.top, active: true }
    const current = drag.current
    if (!current || current.pointerId !== event.pointerId) return
    const body = physics.current[current.index]
    const dx = event.clientX - current.startX
    const dy = event.clientY - current.startY
    if (Math.hypot(dx, dy) > 7) current.moved = true
    if (!current.moved) return
    const nextX = Math.min(Math.max(current.x + dx, body.size / 2 + 5), rect.width - body.size / 2 - 5)
    const nextY = Math.min(Math.max(current.y + dy, body.size / 2 + 5), rect.height - body.size / 2 - 5)
    const elapsed = Math.max(16, performance.now() - current.time)
    current.vx = (nextX - body.x) * 16 / elapsed
    current.vy = (nextY - body.y) * 16 / elapsed
    current.time = performance.now()
    body.x = nextX; body.y = nextY
  }
  const pointerUp = (event, index) => {
    const current = drag.current
    if (!current || current.pointerId !== event.pointerId) return
    const body = physics.current[index]
    body.drag = false
    body.vx = Math.max(-4, Math.min(4, current.vx * .3))
    body.vy = Math.max(-4, Math.min(4, current.vy * .3))
    event.currentTarget.classList.remove('is-dragging')
    drag.current = null
    if (!current.moved && event.type !== 'pointercancel') openProject(index, event.currentTarget)
  }

  const onBrowseMouseEnter = () => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) setBrowseOpen(true)
  }
  const onBrowseMouseLeave = () => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !browsePinned) setBrowseOpen(false)
  }
  const toggleBrowse = () => {
    if (browsePinned) {
      setBrowsePinned(false)
      setBrowseOpen(false)
    } else {
      setBrowsePinned(true)
      setBrowseOpen(true)
    }
  }
  const onBrowseBlur = event => {
    if (!event.currentTarget.contains(event.relatedTarget) && !browsePinned) setBrowseOpen(false)
  }
  const onBrowseKeyDown = event => {
    if (event.key !== 'Escape' || !browseOpen) return
    event.preventDefault()
    event.stopPropagation()
    setBrowsePinned(false)
    setBrowseOpen(false)
    suppressBrowseFocus.current = true
    browseTrigger.current?.focus()
  }
  const onBrowseFocus = () => {
    if (suppressBrowseFocus.current) {
      suppressBrowseFocus.current = false
      return
    }
    setBrowseOpen(true)
  }
  const openFromBrowse = index => {
    setBrowsePinned(false)
    setBrowseOpen(false)
    suppressBrowseFocus.current = true
    openProject(index, browseTrigger.current)
  }

  const activeProject = selected === null ? null : work[selected]

  return <>
    <div className="bubble-field" ref={fieldRef} onPointerMove={pointerMove} onPointerLeave={() => { pointer.current.active = false }} aria-label="Interactive collection of projects">
      {featuredWork.map((project, index) => <button key={project.id} ref={node => { bubbleRefs.current[index] = node }} className={`project-bubble bubble-${index}`} style={{ '--bubble-index': index }} type="button" aria-label={`Open ${project.title} project`} onPointerDown={event => pointerDown(event, index)} onPointerUp={event => pointerUp(event, index)} onPointerCancel={event => pointerUp(event, index)} onClick={event => { if (event.detail === 0 || reduced.current) openProject(index, event.currentTarget) }}>
        <span className="bubble-face">
          <img src={project.image} alt="" loading={index < 3 ? 'eager' : 'lazy'} decoding="async" width="600" height="600" draggable="false" onError={event => {
            if (project.imageFallback && !event.currentTarget.dataset.fallbackApplied) {
              event.currentTarget.dataset.fallbackApplied = 'true'
              event.currentTarget.src = project.imageFallback
            }
          }} />
          <span className="bubble-name">{project.title}</span>
        </span>
      </button>)}
    </div>

    <div className="bubble-controls"><button type="button" onClick={() => { reset.current = true; physics.current.forEach(body => { body.vx = 0; body.vy = 0 }) }}>Reset positions</button></div>

    <div className={`project-list${browseOpen ? ' is-open' : ''}`} onMouseEnter={onBrowseMouseEnter} onMouseLeave={onBrowseMouseLeave} onFocusCapture={onBrowseFocus} onBlurCapture={onBrowseBlur} onKeyDown={onBrowseKeyDown}>
      <button ref={browseTrigger} className="project-list-trigger" type="button" aria-expanded={browseOpen} aria-controls="project-list-panel" onClick={toggleBrowse}>Browse projects <span aria-hidden="true">{browseOpen ? '−' : '+'}</span></button>
      <div id="project-list-panel" className="project-list-panel" aria-hidden={!browseOpen} inert={!browseOpen ? '' : undefined}>
      <ul>{work.map((project, index) => <li key={project.id} data-scroll-reveal="stack" style={{ '--reveal-delay': `${index * 45}ms` }}>
        <button className="project-list-row" type="button" onClick={() => openFromBrowse(index)} aria-label={`View ${project.title}: ${project.line}`}>
          <span className="project-list-thumb"><img src={project.image} alt="" loading="lazy" decoding="async" width="800" height="450" onError={event => {
            if (project.imageFallback && !event.currentTarget.dataset.fallbackApplied) {
              event.currentTarget.dataset.fallbackApplied = 'true'
              event.currentTarget.src = project.imageFallback
            }
          }} /></span>
          <span className="project-list-copy">
            <span className="project-list-type">{project.type}{project.role ? ` / ${project.role}` : ''}</span>
            <strong>{project.title}</strong>
            <span className="project-list-line">{project.line}</span>
            <span className="project-list-description">{project.description}</span>
            <span className="project-list-tags">{project.technologies.slice(0, 3).join(' · ')}</span>
          </span>
          <span className="project-list-action" aria-hidden="true">View</span>
        </button>
      </li>)}</ul>
      </div>
    </div>

    {activeProject && <div className={`project-overlay${revealed ? ' is-open' : ''}`} style={{ '--open-x': origin.x, '--open-y': origin.y, '--open-r': `${origin.r}px` }} onClick={event => { if (event.target === event.currentTarget) closeProject() }}>
      <div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-dialog-title" tabIndex="-1">
        <div className="overlay-head"><span>Project</span><button id="project-close" type="button" onClick={closeProject}>Close <span aria-hidden="true">×</span></button></div>
        <div className={`overlay-body ${projectDirection > 0 ? 'is-forward' : 'is-backward'}`} key={activeProject.id}>
          <div className="overlay-image"><img src={activeProject.image} alt={activeProject.imageAlt} width="1600" height="900" onError={event => {
            if (activeProject.imageFallback && !event.currentTarget.dataset.fallbackApplied) {
              event.currentTarget.dataset.fallbackApplied = 'true'
              event.currentTarget.src = activeProject.imageFallback
            }
          }} /></div>
          <div className="overlay-copy">
            <p className="eyebrow">{activeProject.type}{activeProject.role ? ` / ${activeProject.role}` : ''}</p>
            <h2 id="project-dialog-title">{activeProject.title}</h2>
            <p className="overlay-line">{activeProject.line}</p>
            <p>{activeProject.description}</p>
            {activeProject.idea && <div className="overlay-note"><h3>How it works</h3><p>{activeProject.idea}</p></div>}
            {activeProject.technologies.length > 0 && <ul>{activeProject.technologies.map(tech => <li key={tech}>{tech}</li>)}</ul>}
            <div className="overlay-links">
              <a href={activeProject.path} data-site-link="">Project details</a>
              {activeProject.live && activeProject.live !== '#' && <a href={activeProject.live} target="_blank" rel="noopener noreferrer">Live site</a>}
              {activeProject.github && activeProject.github !== 'https://github.com/' && <a href={activeProject.github} target="_blank" rel="noopener noreferrer">Source code</a>}
            </div>
          </div>
        </div>
        <div className="overlay-foot">
          <button type="button" onClick={() => { setProjectDirection(-1); setSelected(value => (value - 1 + work.length) % work.length) }}>Previous project</button>
          <span aria-live="polite">{activeProject.title}</span>
          <button type="button" onClick={() => { setProjectDirection(1); setSelected(value => (value + 1) % work.length) }}>Next project</button>
        </div>
      </div>
    </div>}
  </>
}
