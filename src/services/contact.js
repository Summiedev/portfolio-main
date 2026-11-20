const API_URL = '/api/contact'
export const contactEmail = 'noorah.light7@gmail.com'
const FALLBACK_MAILTO = `mailto:${contactEmail}`

export async function sendMessage({ firstName, lastName, email, subject, message }) {
  if (!firstName.trim()) throw new Error('First name is required.')
  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('A valid email address is required.')
  if (!message.trim()) throw new Error('Message cannot be empty.')

  let res
  try {
    res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, subject: subject || 'Portfolio enquiry', message }),
    })
  } catch {
    res = null
  }

  if (!res || res.status === 404 || res.status === 500 || (res.ok && !res.headers.get('content-type')?.includes('application/json'))) {
    const mailto = `${FALLBACK_MAILTO}?subject=${encodeURIComponent(subject || 'Portfolio enquiry')}&body=${encodeURIComponent(
      `From: ${firstName} ${lastName} <${email}>\n\n${message}`
    )}`
    window.location.href = mailto
    return { ok: true, via: 'mailto' }
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.error || 'Failed to send message. Please try again.')
  }

  return { ok: true, via: 'formspree' }
}
