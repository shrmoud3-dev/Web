import { useState } from 'react'
import { Alert, Box, Button, TextField } from '@mui/material'
import { content } from '../data/content.js'

// Contact form — same destination as the original site: FormSubmit AJAX
// to sagkanb3@gmail.com. First submission triggers FormSubmit's one-time
// activation email to that inbox (original behaviour, unchanged).
export default function ContactForm() {
  const [state, setState] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  async function submit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('https://formsubmit.co/ajax/sagkanb3@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...state, _subject: 'New message from your portfolio site' }),
      })
      if (!res.ok) throw new Error('send failed')
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }
  if (status === 'sent') {
    return <Alert severity="success" sx={{ mt: 2 }}>Thanks — your message is on its way. I&apos;ll get back to you soon!</Alert>
  }
  return (
    <Box component="form" onSubmit={submit} sx={{ maxWidth: 560, textAlign: 'left' }}>
      <TextField fullWidth label="Your email" type="email" name="email" required margin="normal"
        value={state.email} onChange={(e) => setState({ ...state, email: e.target.value })} />
      <TextField fullWidth label="Your name" name="name" required margin="normal"
        value={state.name} onChange={(e) => setState({ ...state, name: e.target.value })} />
      <TextField fullWidth label="Write your message here..." name="message" required multiline rows={5} margin="normal"
        value={state.message} onChange={(e) => setState({ ...state, message: e.target.value })} />
      <Button type="submit" variant="contained" size="large" disabled={status === 'sending'} sx={{ mt: 2, px: 4, py: 1.5 }}>
        {status === 'sending' ? 'Sending…' : 'Send email'}
      </Button>
      {status === 'error' && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Something went wrong sending just now — please email {content.contactEmail} directly.
        </Alert>
      )}
    </Box>
  )
}
