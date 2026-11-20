import { projects } from './projects.js'

const projectStories = {
  clinsight: {
    slug: 'clinsight', title: 'Clinsight', type: 'Healthcare app',
    line: 'Lab results, explained more clearly.',
    description: 'Clinsight helps people understand lab reports with clear, AI-assisted explanations and optional medical review.',
    idea: '', role: 'Backend development', decisions: [],
    imageAlt: 'Clinsight homepage showing its lab result explanation interface',
  },
  floodline: {
    slug: 'floodline', type: 'Civic tech / mobility',
    line: 'Safer movement through flood-prone places.',
    description: 'A hyperlocal flood-mobility assistant that brings community reports, official warnings, saved-place alerts, and route-risk checks into one clear interface.',
    idea: 'FloodLine combines spatial data, community reports and official warnings so people can understand changing conditions before and during a trip.',
    decisions: [
      ['Turning reports into route context', 'Location, severity and recency are connected to the places and routes a person uses.'],
      ['Monitoring changing conditions', 'Saved places and active-navigation flows surface updates instead of requiring constant checking.'],
      ['Keeping maps readable', 'The interface emphasizes passable, uncertain and avoid states rather than exposing raw technical data.'],
    ],
    imageAlt: 'FloodLine map interface showing flood-aware routes and route-risk information',
  },
  memora: {
    slug: 'memora', type: 'Product / social journaling',
    line: 'A place to keep memories together.',
    description: 'Diary entries, photos, time capsules, group journals, and live chat in one memory-keeping app.',
    idea: 'Memora keeps time capsules locked until their unlock date and uses Socket.io for live chat.',
    decisions: [
      ['Time capsules', 'Entries can be revisited immediately, while time capsules stay locked until a future date.'],
      ['Sharing', 'Group diaries, friend requests and secret entries use separate access rules.'],
      ['Live chat', 'Socket.io handles chat, presence and notifications.'],
    ],
    imageAlt: 'Memora memory-keeping application interface',
  },
  verdikt: {
    slug: 'verdikt', type: 'Product / multiplayer',
    line: 'A multiplayer game for group polls.',
    description: 'A live social polling game where friends join a room, cast votes, and see results unfold together.',
    idea: 'The server manages rooms and votes, while WebSocket events keep players up to date.',
    decisions: [
      ['Rooms and questions', 'Spring Boot handles room creation, host controls and question progression.'],
      ['Live voting', 'STOMP over WebSocket sends votes and results to connected players.'],
      ['Vote history', 'PostgreSQL stores rooms, players, questions and votes.'],
    ],
    imageAlt: 'Verdikt multiplayer polling game landing page',
  },
  mizan: {
    slug: 'mizan', type: 'Product / mobile habit building',
    line: 'A tracker for daily good deeds.',
    description: 'A good-deeds tracker with jars, streaks, family participation, and rewards based on the Islamic calendar.',
    idea: 'Mizan turns daily acts into stars and jars. The backend handles rewards, streaks and family progress for the Flutter app.',
    decisions: [
      ['Calendar-aware rewards', 'Friday and Ramadan change the weight of an act through backend rules.'],
      ['Protecting star totals', 'Idempotent submissions and row-level locking prevent duplicate updates.'],
      ['Family jars', 'Family members can contribute to a shared goal and receive live updates.'],
    ],
    imageAlt: 'Mizan good-deeds tracker interface',
  },
  recyclog: {
    slug: 'recyclog', type: 'Civic tech / data',
    line: 'A dashboard for simulated waste collection.',
    description: 'A Lagos smart-bin simulation with a live map, waste analytics, and generated operational insights.',
    idea: 'RecycLog uses simulated sensors across five wards to show what a connected waste system could reveal. The dashboard turns bin events into maps, trends and alerts.',
    decisions: [
      ['Simulated bins', 'Scheduled jobs simulate bin fill levels and collection activity.'],
      ['Waste data', 'MongoDB aggregations assemble ward, bin and waste-type statistics.'],
      ['Insights', 'Rule-based summaries remain available if the external AI service fails.'],
    ],
    imageAlt: 'RecycLog waste management dashboard',
  },
  insighta: {
    slug: 'insighta-labs', type: 'Data tool / API and CLI',
    line: 'Search demographic data on the web or in the terminal.',
    description: 'A demographic query platform with natural-language search, GitHub sign-in, and a companion command-line client.',
    idea: 'The browser and CLI use the same serverless API for filtering and search. Query rules live in one place instead of being reimplemented in each interface.',
    decisions: [
      ['A parser without an LLM', 'A rule-based natural-language parser turns common age, gender and country phrases into filters.'],
      ['Shared API', 'The CLI uses the same backend as the browser.'],
      ['Sign-in', 'GitHub OAuth with PKCE, rotating refresh tokens and role checks handle access.'],
    ],
    imageAlt: 'Insighta Labs demographic data interface',
  },
  eventStore: {
    slug: 'append-only-event-store', type: 'Experiment / storage engine',
    line: 'A small event store built around a log file.',
    description: 'A small HTTP event store where an append-only log is the persistence layer and reads use byte offsets.',
    idea: 'Every event is one line in a log file. An in-memory map remembers its byte offset, so a point read can seek directly to the right place. Restarting rebuilds the map from the file.',
    decisions: [
      ['Writes in order', 'A promise queue serializes appends so concurrent requests cannot interleave records.'],
      ['Fast reads from a plain file', 'An in-memory offset and length map makes point reads a positional file operation.'],
      ['Recovery by replay', 'A streamed pass rebuilds the index without loading the entire log at once.'],
    ],
    imageAlt: 'Append-only event store diagram showing log records and an in-memory index',
  },
}

const order = ['clinsight', 'floodline', 'memora', 'verdikt', 'mizan', 'recyclog', 'insighta', 'eventStore']

export const work = order.map(key => {
  const project = projects[key] || {}
  return {
    id: key,
    ...project,
    ...projectStories[key],
    image: key === 'clinsight'
      ? '/covers/clinsight-website.png'
      : project.coverImage || 'https://www.useclinsight.com/assets/header-assets/clinsight-logo.svg',
    ...(key === 'clinsight' ? { imageFallback: 'https://www.useclinsight.com/assets/header-assets/clinsight-logo.svg' } : {}),
    path: `/work/${projectStories[key].slug}`,
    technologies: (project.tags || []).slice(0, 4),
    ...(projectStories[key].role ? { role: projectStories[key].role } : {}),
    ...(key === 'clinsight' ? { github: '', live: 'https://www.useclinsight.com/' } : {}),
  }
})

export const experience = [
  {
    period: 'Apr to Jun 2026',
    role: 'Backend Engineer Intern',
    place: 'HNG Internship',
    summary: 'Worked on ClinSight backend features with FastAPI, including secure endpoints, authentication, and data access.',
    highlights: [
      'Built a DAG-based job scheduler with worker pipelines, retries, backoff, and dead-letter handling.',
      'Added Server-Sent Events and WebSocket updates, including client reconnection.',
      'Used Redis for caching, distributed locks, and worker coordination.',
      'Implemented OAuth 2.0, JWT, and role-based access control.',
      'Improved PostgreSQL and MongoDB schemas, indexes, queries, and transaction handling.',
      'Worked through Git reviews, issue tracking, and CI/CD with the team.',
    ],
    technologies: ['FastAPI', 'Redis', 'WebSockets', 'PostgreSQL'],
  },
  {
    period: 'Sep 2025 to Jan 2026',
    role: 'Web Development Instructor & Full Stack Developer',
    place: 'Haut Hub Institute',
    summary: 'Taught practical web development and built full-stack applications with Next.js, Node.js, Express, and PostgreSQL.',
    highlights: [
      'Taught HTML, CSS, JavaScript, TypeScript, React, Next.js, Node.js, Express, PostgreSQL, and REST APIs.',
      'Mentored students through Git workflows, debugging, testing, API integration, and deployment.',
      'Guided capstone projects on application architecture, backend design, and deployment.',
    ],
    technologies: ['Next.js', 'Node.js', 'Express.js', 'PostgreSQL'],
  },
  {
    period: 'Jan to Jun 2025',
    role: 'Backend Developer Intern',
    place: 'Belsoft Systems',
    summary: 'Built API features and transaction workflows for CashPoint, and backend modules for BelPower utility payments.',
    highlights: [
      'Implemented JWT authentication and role-based access control.',
      'Designed and documented REST APIs with request validation, consistent errors, and versioning.',
      'Modeled PostgreSQL tables and tuned indexes and queries for data integrity and performance.',
      'Contributed through feature work, debugging, code reviews, and deployment.',
    ],
    technologies: ['Node.js', 'Express.js', 'PostgreSQL', 'JWT'],
  },
]
