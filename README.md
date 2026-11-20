# Summie portfolio

A React and Vite portfolio for Summie, a Software Engineer based in Lagos. The site uses a draggable project world, expandable skills, a writing stack, individual project and article pages, and a working contact form.

## Run locally

```sh
npm install
npm run dev
```

Run `npm run build` to create the production site in `dist/`.

## Content

- Project links, descriptions, and detailed source notes live in `src/data/projects.js`.
- Curated project stories and the shared project collection live in `src/data/siteContent.js`.
- The project interaction and lightweight physics live in `src/components/BubbleWorld.jsx`.
- Writing content lives in `src/data/writings.js`.
- Section layouts live in `src/components/sections.jsx` and story pages in `src/components/pages.jsx`.
- Project screenshots live in `public/covers/`.
- The resume URL is in `src/services/resume.js` and the contact email is in `src/services/contact.js`.

## Contact form

The existing Vercel function at `api/contact.js` forwards messages to Formspree when `FORMSPREE_ID` is configured in the deployment environment. If the API is unavailable, the form opens the visitor's email application with their message ready to send. The email address is also visible in the Contact section.

## Browser review

With the dev server running, `node qa-browser.mjs` uses headless Chrome to check 320px, 375px, tablet, and desktop layouts, test the key interactions, and save screenshots to `docs/screenshots/`.
