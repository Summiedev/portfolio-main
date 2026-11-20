import { spawn } from 'node:child_process'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const profile = await mkdtemp(join(tmpdir(), 'summie-universe-qa-'))
const browser = spawn(chrome, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=9223', `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' })
const out = resolve(process.env.QA_OUTPUT_DIR ?? 'docs/screenshots')
const widths = process.env.QA_WIDTHS?.split(',').map(Number).filter(Number.isFinite) ?? [320, 375, 768, 1440]
await mkdir(out, { recursive: true })
let socket
let nextId = 1
const pending = new Map()
const issues = []
const wait = ms => new Promise(done => setTimeout(done, ms))

async function connect() {
  let pages
  for (let attempt = 0; attempt < 50; attempt++) {
    try { pages = await (await fetch('http://127.0.0.1:9223/json')).json(); if (pages?.[0]) break } catch { /* Chrome is starting. */ }
    await wait(200)
  }
  if (!pages?.[0]) throw new Error('Chrome DevTools did not start')
  socket = new WebSocket(pages[0].webSocketDebuggerUrl)
  await new Promise((done, reject) => { socket.addEventListener('open', done, { once: true }); socket.addEventListener('error', reject, { once: true }) })
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data)
    if (message.method === 'Runtime.exceptionThrown') issues.push(message.params.exceptionDetails.text)
    if (message.id && pending.has(message.id)) {
      const { done, reject } = pending.get(message.id)
      pending.delete(message.id)
      message.error ? reject(new Error(message.error.message)) : done(message.result)
    }
  })
  await send('Page.enable')
  await send('Runtime.enable')
}

function send(method, params = {}) {
  const id = nextId++
  return new Promise((done, reject) => { pending.set(id, { done, reject }); socket.send(JSON.stringify({ id, method, params })) })
}

async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails))
  return result.result?.value
}

async function shot(name) {
  const result = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
  await writeFile(join(out, name), Buffer.from(result.data, 'base64'))
}

async function navigate(path) {
  await send('Page.navigate', { url: `http://127.0.0.1:5173${path}` })
  for (let attempt = 0; attempt < 40; attempt++) {
    await wait(100)
    if (await evaluate(path === '/' ? 'document.querySelectorAll(".project-bubble").length === 8' : 'Boolean(document.querySelector("main h1"))')) break
  }
  await wait(path === '/' ? 800 : 250)
}

try {
  await connect()
  for (const width of widths) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 650 })
    await navigate('/')
    const metrics = await evaluate('({title:document.title, width:document.documentElement.scrollWidth, viewport:innerWidth, hero:document.querySelector(".hero")?.getBoundingClientRect().height, bubbles:document.querySelectorAll(".project-bubble").length})')
    console.log('home', width, JSON.stringify(metrics))
    await shot(`universe-home-${width}.png`)
    await evaluate('document.querySelector("#work")?.scrollIntoView({behavior:"instant"})')
    await wait(350)
    await shot(`universe-work-${width}.png`)
    await evaluate('document.querySelector(".project-list")?.scrollIntoView({behavior:"instant"})')
    await wait(300)
    console.log('project-list', width, await evaluate('({rows:document.querySelectorAll(".project-list-row").length, expanded:document.querySelector(".project-list-trigger")?.getAttribute("aria-expanded"), panelVisibility:getComputedStyle(document.querySelector(".project-list-panel")).visibility, loadedImages:[...document.querySelectorAll(".project-list-thumb img")].filter(image => image.complete && image.naturalWidth > 0).length})'))
    await shot(`universe-list-${width}.png`)
    if (width >= 650) {
      const trigger = await evaluate('(() => {const r=document.querySelector(".project-list-trigger").getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}})()')
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: trigger.x, y: trigger.y })
      await wait(220)
      console.log('project-list-hover', width, await evaluate('({expanded:document.querySelector(".project-list-trigger")?.getAttribute("aria-expanded"),visibility:getComputedStyle(document.querySelector(".project-list-panel")).visibility})'))
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 4, y: 4 })
      await wait(220)
    }
    await evaluate('document.querySelector(".project-list-trigger")?.focus()')
    console.log('project-list-focus', width, await evaluate('({expanded:document.querySelector(".project-list-trigger")?.getAttribute("aria-expanded"),visibility:getComputedStyle(document.querySelector(".project-list-panel")).visibility})'))
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' })
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape' })
    console.log('project-list-escape', width, await evaluate('({expanded:document.querySelector(".project-list-trigger")?.getAttribute("aria-expanded"),focus:document.activeElement===document.querySelector(".project-list-trigger")})'))
    await evaluate('document.querySelector(".project-list-trigger")?.click()')
    console.log('project-list-click', width, await evaluate('({expanded:document.querySelector(".project-list-trigger")?.getAttribute("aria-expanded"),visibility:getComputedStyle(document.querySelector(".project-list-panel")).visibility})'))
    await shot(`universe-list-open-${width}.png`)
    await evaluate('document.querySelector(".project-list-row")?.click()')
    await wait(400)
    console.log('overlay', width, await evaluate('({heading:document.querySelector(".overlay-copy h2")?.textContent, open:document.querySelector(".project-overlay")?.classList.contains("is-open"), width:document.documentElement.scrollWidth, viewport:innerWidth})'))
    await shot(`universe-overlay-${width}.png`)
    await evaluate('document.querySelector("#project-close")?.click()')
    await wait(450)
    await evaluate('document.querySelector("#skills")?.scrollIntoView({behavior:"instant"})')
    await wait(220)
    await shot(`universe-skills-${width}.png`)
    await evaluate('document.querySelectorAll(".skill-layer button")[1]?.click()')
    console.log('skill-open', width, await evaluate('({expanded:document.querySelectorAll(".skill-layer button")[1]?.getAttribute("aria-expanded"),revealed:document.querySelectorAll(".skill-layer")[1]?.getAttribute("data-revealed")})'))
    await wait(450)
    await shot(`universe-skills-open-${width}.png`)
    await evaluate('document.querySelectorAll(".skill-layer button")[1]?.click()')
    console.log('skill-close', width, await evaluate('({expanded:document.querySelectorAll(".skill-layer button")[1]?.getAttribute("aria-expanded"),revealed:document.querySelectorAll(".skill-layer")[1]?.getAttribute("data-revealed")})'))
    await evaluate('document.querySelector("#about")?.scrollIntoView({behavior:"instant"})')
    await wait(220)
    await shot(`universe-about-${width}.png`)
    await evaluate('document.querySelector(".experience-item summary")?.click()')
    console.log('experience-details', width, await evaluate('({open:document.querySelector(".experience-item")?.open,bullets:document.querySelectorAll(".experience-item[open] .experience-details li").length})'))
    await evaluate('document.querySelector("#writing")?.scrollIntoView({behavior:"instant"})')
    await wait(220)
    await evaluate('document.querySelector(".writing-categories button")?.click()')
    await wait(100)
    console.log('writing-layout', width, await evaluate('(() => {const shelf=document.querySelector(".writing-shelf");return {columns:getComputedStyle(shelf).gridTemplateColumns,books:[...shelf.children].map(book=>({width:book.getBoundingClientRect().width,column:getComputedStyle(book).gridColumn}))}})()'))
    await shot(`universe-writing-${width}.png`)
    if (width >= 650) {
      const book = await evaluate('(() => {const r=document.querySelector(".writing-book a")?.getBoundingClientRect();return r?{x:r.left+r.width/2,y:r.top+r.height/2}:null})()')
      if (book) {
        await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: book.x, y: book.y })
        await wait(350)
        await shot(`universe-writing-hover-${width}.png`)
        await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 4, y: 4 })
      }
    }
    await evaluate('document.querySelectorAll(".writing-categories button")[1]?.click()')
    console.log('writing-filter', width, await evaluate('({category:document.querySelector(".writing-categories .is-active")?.textContent, count:document.querySelectorAll(".writing-book").length, sidebar:!!document.querySelector(".writing-side"), title:document.querySelector(".writing-book strong")?.textContent})'))
    await evaluate('document.querySelector("#contact")?.scrollIntoView({behavior:"instant"})')
    await wait(220)
    await shot(`universe-contact-${width}.png`)
  }
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
  await navigate('/work/memora')
  console.log('detail', await evaluate('({title:document.title, heading:document.querySelector("main h1")?.textContent, width:document.documentElement.scrollWidth, viewport:innerWidth})'))
  await shot('universe-detail-1440.png')
  await navigate('/work/clinsight')
  console.log('clinsight-detail', await evaluate('({title:document.title, heading:document.querySelector("main h1")?.textContent, role:document.querySelector(".project-role")?.textContent, live:document.querySelector(".detail-links a")?.href, width:document.documentElement.scrollWidth, viewport:innerWidth})'))
  await shot('clinsight-detail-1440.png')
  await navigate('/writing/the-second-tap-is-a-design-problem')
  console.log('article', await evaluate('({title:document.title, heading:document.querySelector("main h1")?.textContent, width:document.documentElement.scrollWidth, viewport:innerWidth})'))
  await shot('universe-article-1440.png')
  for (const width of [320, 375]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: true })
    await navigate('/work/dilamme-scheduler')
    console.log('detail-mobile', width, await evaluate('({width:document.documentElement.scrollWidth, viewport:innerWidth, image:(()=>{const i=document.querySelector(".detail-visual img");const r=i.getBoundingClientRect();return {width:r.width,height:r.height,naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight,fit:getComputedStyle(i).objectFit}})()})'))
    await shot(`universe-detail-${width}.png`)
    await navigate('/writing/the-second-tap-is-a-design-problem')
    console.log('article-mobile', width, await evaluate('({width:document.documentElement.scrollWidth, viewport:innerWidth})'))
    await shot(`universe-article-${width}.png`)
  }
  await navigate('/')
  await evaluate('document.querySelector(".menu-button")?.click()')
  console.log('menu-open', await evaluate('document.querySelector(".menu-button")?.getAttribute("aria-expanded")'))
  await evaluate('document.querySelector(".menu-button")?.click()')
  await evaluate('document.querySelector("#work")?.scrollIntoView({behavior:"instant"})')
  await wait(200)
  const beforeDrag = await evaluate('(() => {const r=document.querySelector(".project-bubble").getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}})()')
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: beforeDrag.x, y: beforeDrag.y })
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: beforeDrag.x, y: beforeDrag.y, button: 'left', clickCount: 1 })
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: beforeDrag.x + 54, y: beforeDrag.y + 30, buttons: 1 })
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: beforeDrag.x + 54, y: beforeDrag.y + 30, button: 'left', clickCount: 1 })
  await wait(150)
  console.log('drag', await evaluate('({isOpen:Boolean(document.querySelector(".project-overlay")),transform:document.querySelector(".project-bubble")?.style.transform})'))
  await evaluate('document.querySelector(".project-list-row")?.click()')
  await evaluate('document.querySelector(".overlay-foot button:last-child")?.click()')
  console.log('overlay-next', await evaluate('document.querySelector(".overlay-copy h2")?.textContent'))
  await evaluate('document.querySelector(".overlay-links a")?.click()')
  await wait(250)
  console.log('internal-nav', await evaluate('({path:location.pathname, heading:document.querySelector("main h1")?.textContent})'))
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  await navigate('/')
  await evaluate('document.querySelector("#work")?.scrollIntoView({behavior:"instant"})')
  await wait(200)
  const reducedBubble = await evaluate('(() => {const r=document.querySelector(".project-bubble").getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}})()')
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: reducedBubble.x, y: reducedBubble.y })
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: reducedBubble.x, y: reducedBubble.y, button: 'left', clickCount: 1 })
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: reducedBubble.x, y: reducedBubble.y, button: 'left', clickCount: 1 })
  console.log('reduced-motion', await evaluate('({enabled:matchMedia("(prefers-reduced-motion: reduce)").matches, open:Boolean(document.querySelector(".project-overlay")), animation:getComputedStyle(document.querySelector(".hero h1")).animationName})'))
  console.log('runtime issues', JSON.stringify(issues))
} finally {
  socket?.close()
  if (browser.exitCode === null && browser.signalCode === null) {
    const closed = new Promise(resolve => browser.once('exit', resolve))
    browser.kill()
    await Promise.race([closed, wait(2000)])
  }
  try {
    await rm(profile, { recursive: true, force: true })
  } catch (error) {
    if (!['EBUSY', 'EPERM'].includes(error.code)) throw error
  }
}
