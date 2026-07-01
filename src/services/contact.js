/**
 * Contact form submission service.
 *
 * HOW TO USE:
 * 1. Go to https://formspree.io and create a free account.
 * 2. Create a new form — you'll get a form ID like "xpzvwgkb".
 * 3. Replace YOUR_FORMSPREE_ID below with that ID.
 * 4. That's it — messages will arrive in your email inbox.
 *
 * Alternatively, swap sendMessage() for any backend/API you prefer.
 */

const FORMSPREE_ID = 'YOUR_FORMSPREE_ID' // ← replace this

export async function sendMessage({ firstName, lastName, email, subject, message }) {
  // Validate before sending
  if (!firstName.trim()) throw new Error('First name is required.')
  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('A valid email address is required.')
  if (!message.trim()) throw new Error('Message cannot be empty.')

  if (FORMSPREE_ID === 'YOUR_FORMSPREE_ID') {
    // Fallback: open the user's mail client with prefilled body
    const mailto = `mailto:noorah@email.com?subject=${encodeURIComponent(subject || 'Portfolio enquiry')}&body=${encodeURIComponent(
      `From: ${firstName} ${lastName} <${email}>\n\n${message}`
    )}`
    window.location.href = mailto
    return { ok: true, via: 'mailto' }
  }

  const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
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

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.error || 'Failed to send message. Please try again.')
  }

  return { ok: true, via: 'formspree' }
}
