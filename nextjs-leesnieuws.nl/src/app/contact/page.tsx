'use client'
import { useState } from 'react'

export default function ContactPage() {
  const [naam, setNaam] = useState('')
  const [email, setEmail] = useState('')
  const [bericht, setBericht] = useState('')
  const [status, setStatus] = useState<'idle'|'sending'|'success'|'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit() {
    if (!naam || !email || !bericht) {
      setErrorMsg('Vul alle velden in.'); return
    }
    setStatus('sending'); setErrorMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ naam, email, bericht })
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
        setNaam(''); setEmail(''); setBericht('')
      } else {
        setErrorMsg(data.error || 'Er ging iets mis.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Er ging iets mis. Probeer opnieuw.')
      setStatus('error')
    }
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: "'Nunito Sans',sans-serif" }}>
      <header style={{ background: 'var(--surface)', borderBottom: '2px solid var(--ink)', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(30,27,23,.07)' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 62 }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, letterSpacing: '-.5px', color: 'var(--ink)' }}>
              Lees<span style={{ color: 'var(--teal)' }}>Nieuws</span>
            </div>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 1 }}>
              Eenvoudig Nederlands leren
            </div>
          </a>
        </div>
      </header>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '48px 24px 80px' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontFamily: "'Nunito',sans-serif", fontWeight: 600, color: 'var(--muted)', textDecoration: 'none', marginBottom: 28 }}>
          ← Terug naar nieuws
        </a>

        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 34, fontWeight: 700, letterSpacing: '-.5px', color: 'var(--ink)', marginBottom: 8 }}>Contact</h1>
        <p style={{ fontSize: 15, color: 'var(--mid)', lineHeight: 1.7, marginBottom: 36 }}>
          Heb je een vraag, suggestie of wil je samenwerken? Stuur ons een bericht en we reageren zo snel mogelijk.
        </p>

        {status === 'success' && (
          <div style={{ background: 'var(--green-light)', border: '1px solid #b8eaca', borderRadius: 10, padding: '16px 18px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>✅</span>
            <div>
              <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--green)' }}>Bericht verzonden!</div>
              <div style={{ fontSize: 13, color: 'var(--mid)', marginTop: 2 }}>We reageren zo snel mogelijk.</div>
            </div>
          </div>
        )}

        {(status === 'error' || errorMsg) && (
          <div style={{ background: 'var(--rose-light)', border: '1px solid #f5c0bb', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: 'var(--rose)', fontFamily: "'Nunito',sans-serif" }}>
            ⚠ {errorMsg}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ display: 'block', fontFamily: "'Nunito',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: 6 }}>Naam</label>
            <input type="text" placeholder="Jouw naam" value={naam} onChange={e => setNaam(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontFamily: "'Nunito Sans',sans-serif", fontSize: 14, color: 'var(--ink)', background: 'var(--surface)', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: "'Nunito',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: 6 }}>E-mailadres</label>
            <input type="email" placeholder="jij@email.com" value={email} onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontFamily: "'Nunito Sans',sans-serif", fontSize: 14, color: 'var(--ink)', background: 'var(--surface)', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: "'Nunito',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: 6 }}>Bericht</label>
            <textarea placeholder="Schrijf hier jouw bericht…" rows={6} value={bericht} onChange={e => setBericht(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontFamily: "'Nunito Sans',sans-serif", fontSize: 14, color: 'var(--ink)', background: 'var(--surface)', outline: 'none', resize: 'vertical', lineHeight: 1.6 }} />
          </div>
          <button onClick={handleSubmit} disabled={status === 'sending'}
            style={{ width: '100%', padding: 14, background: status === 'sending' ? 'var(--teal-mid)' : 'var(--teal)', color: '#fff', border: 'none', borderRadius: 10, fontFamily: "'Nunito',sans-serif", fontSize: 15, fontWeight: 700, cursor: status === 'sending' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {status === 'sending' ? 'Verzenden…' : 'Verstuur bericht →'}
          </button>
        </div>
      </div>
    </div>
  )
}