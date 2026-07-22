const FORMSPREE_ID = process.env.FORMSPREE_ID

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!FORMSPREE_ID) {
    return res.status(500).json({ error: 'Formspree is not configured on the server.' })
  }

  const { firstName, lastName, email, subject, message } = req.body || {}

  const formspreeRes = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
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

  const data = await formspreeRes.json().catch(() => ({}))

  if (!formspreeRes.ok) {
    return res.status(formspreeRes.status).json({ error: data?.error || 'Failed to send message.' })
  }

  return res.status(200).json({ ok: true })
}
