const API_URL = '/api/contact'
const FALLBACK_MAILTO = 'mailto:summie777@gmail.com'

export async function sendMessage({ firstName, lastName, email, subject, message }) {
  if (!firstName.trim()) throw new Error('First name is required.')
  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('A valid email address is required.')
  if (!message.trim()) throw new Error('Message cannot be empty.')

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      subject: subject || 'Portfolio enquiry',
      message,
    }),
  })

  if (res.status === 500) {
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
