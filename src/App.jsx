import { useState } from 'react'
import { useCountUp, useCursor, useReveal } from './components/shared.jsx'
import { About, Blog, Contact, Experience, Footer, Hero, Navbar, ProjectModal, Projects, Skills, StatsBar } from './components/sections.jsx'

export default function App() {
  const [isDark, setIsDark] = useState(true)
  const [activeProject, setActiveProject] = useState(null)

  useReveal()
  useCountUp()
  useCursor()

  return (
    <>
      <div className="cursor" id="cursor" />
      <div className="cursor-ring" id="cursor-ring" />
      <Navbar isDark={isDark} setIsDark={setIsDark} />
      <Hero />
      <StatsBar />
      <About />
      <div className="gap-section" />
      <Projects onProjectClick={setActiveProject} />
      <div className="gap-section" />
      <Skills />
      <div className="gap-section" />
      <Experience />
      <div className="gap-section" />
      <Blog />
      <div className="gap-section" />
      <Contact />
      <Footer />
      {activeProject && <ProjectModal projectKey={activeProject} onClose={() => setActiveProject(null)} />}
    </>
  )
}
