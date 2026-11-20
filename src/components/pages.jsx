import { useEffect, useRef } from 'react'
import { work } from '../data/siteContent.js'
import { writings } from '../data/writings.js'
import { Arrow, ProjectImage, SiteLink } from './sections.jsx'

export function ProjectPage({ project }) {
  const position = work.findIndex(item => item.id === project.id)
  const next = work[(position + 1) % work.length]
  const dialog = useRef(null)
  useEffect(() => {
    const node = dialog.current
    if (!node) return
    const closeOnBackdrop = event => { if (event.target === node) node.close() }
    node.addEventListener('click', closeOnBackdrop)
    return () => node.removeEventListener('click', closeOnBackdrop)
  }, [])

  return <main className={`project-page project-page-${position % 3}`}>
    <div className="detail-top page-pad"><SiteLink href="/#work" className="back-link">← Back to the work</SiteLink><span>{project.type}</span></div>
    <div className="detail-opening page-pad" data-scroll-reveal><div><p className="detail-overline">Project story</p><h1>{project.title}</h1></div><p>{project.line}</p></div>
    <div className="detail-visual page-pad" data-scroll-reveal><button type="button" onClick={() => dialog.current?.showModal()} aria-label={`Enlarge image of ${project.title}`}><ProjectImage project={project} eager /><span>View image ↗</span></button></div>
    <div className="detail-body page-pad"><div className="detail-side" data-scroll-reveal><span>About this project</span>{project.role && <p className="project-role"><strong>My role</strong>{project.role}</p>}<div className="detail-links">{project.live && project.live !== '#' && <a href={project.live} target="_blank" rel="noopener noreferrer">Visit live site <Arrow diagonal /></a>}{project.github && project.github !== 'https://github.com/' && <a href={project.github} target="_blank" rel="noopener noreferrer">View source <Arrow diagonal /></a>}</div></div><div className="detail-story"><p className="detail-lead" data-scroll-reveal>{project.description}</p>{project.idea && <p data-scroll-reveal>{project.idea}</p>}{project.decisions?.length > 0 && <><h2 data-scroll-reveal>What shaped it</h2><div className="decision-list">{project.decisions.map(([title, text], index) => <section key={title} data-scroll-reveal style={{ '--reveal-delay': `${Math.min(index * 65, 195)}ms` }}><h3>{title}</h3><p>{text}</p></section>)}</div></>}{project.tags?.length > 0 && <div className="detail-stack" data-scroll-reveal><h2>Built with</h2><ul>{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></div>}</div></div>
    <SiteLink href={next.path} className="next-project page-pad"><span>Next project</span><strong>{next.title}</strong><Arrow diagonal /></SiteLink>
    <dialog className="image-dialog" ref={dialog} aria-label={`Larger view of ${project.title}`}><button className="image-dialog-close" type="button" onClick={() => dialog.current?.close()}>Close ×</button><ProjectImage project={project} eager /><p>{project.title}</p></dialog>
  </main>
}

export function WritingPage({ writing }) {
  const position = writings.findIndex(item => item.slug === writing.slug)
  const next = writings[(position + 1) % writings.length]
  const related = work.find(item => item.slug === writing.relatedProject)
  return <main className="article-page page-pad"><div className="article-top"><SiteLink href="/#writing" className="back-link">← Back to writing</SiteLink><span>{writing.topic}</span></div><header className="article-header" data-scroll-reveal><p>Writing by Noorah</p><h1>{writing.title}</h1><div className="article-rule" /><p className="article-lead">{writing.lead}</p></header><article className="article-body">{writing.paragraphs.map((paragraph, index) => <p key={paragraph} data-scroll-reveal style={{ '--reveal-delay': `${Math.min(index % 3 * 55, 110)}ms` }}>{paragraph}</p>)}</article>{related && <aside className="article-related" data-scroll-reveal><span>Related work</span><SiteLink href={related.path}>{related.title} <Arrow diagonal /></SiteLink><p>{related.line}</p></aside>}<SiteLink className="article-next" href={`/writing/${next.slug}`} data-scroll-reveal><span>Read next</span><strong>{next.title} <Arrow diagonal /></strong></SiteLink></main>
}

export function NotFound() {
  return <main className="not-found page-pad"><p>That page was not found.</p><h1>Nothing here.</h1><SiteLink href="/">Return home <Arrow /></SiteLink></main>
}
