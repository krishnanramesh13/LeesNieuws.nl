'use client'
import { useState } from 'react'
import { PortableText } from '@portabletext/react'

interface Woord { woord: string; betekenis: string }
interface Artikel {
  _id: string; kop: string; ondertitel?: string; categorie: string
  niveau?: string; leestijd?: number; tekst?: any[]; woordenlijst?: Woord[]
  datum?: string; afbeelding?: { url: string; alt?: string }
}
interface WoordVanDeDag {
  woord: string; definitie: string; voorbeeldzin: string; datum?: string
}

function formatDate(ds?: string) {
  if (!ds) return ''
  return new Date(ds).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
}

function getPlainText(tekst?: any[]): string {
  if (!tekst) return ''
  return tekst.map(b => b.children?.map((c: any) => c.text).join('') || '').join(' ')
}

function WordChip({ woord, betekenis }: { woord: string; betekenis: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{
        background: hovered ? '#1d9e75' : '#ddf2ec',
        color: hovered ? '#fff' : '#1a6b55',
        borderRadius: 4, padding: '1px 6px',
        fontWeight: 600, cursor: 'default',
        transition: 'all .2s', userSelect: 'none',
        borderBottom: '2px dotted #1d9e75'
      }}>
        {woord}
      </span>
      {hovered && (
        <span style={{
          position: 'absolute', bottom: '120%', left: '50%',
          transform: 'translateX(-50%)',
          background: '#1a1410', color: '#fff',
          padding: '6px 12px', borderRadius: 8,
          fontSize: 12, fontFamily: "'Nunito',sans-serif",
          fontWeight: 600, whiteSpace: 'nowrap',
          zIndex: 999, boxShadow: '0 4px 16px rgba(0,0,0,.25)',
          pointerEvents: 'none'
        }}>
          {betekenis}
          <span style={{
            position: 'absolute', top: '100%', left: '50%',
            transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '5px solid #1a1410'
          }} />
        </span>
      )}
    </span>
  )
}

function InlineWord({ word, meaning }: { word: string; meaning: string }) {
  const [show, setShow] = useState(false)
  return (
    <span style={{ position: 'relative', display: 'inline' }}>
      <span
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        style={{
          borderBottom: '2px dotted var(--teal)',
          cursor: 'help',
          color: 'inherit',
          transition: 'color .15s',
        }}>
        {word}
      </span>
      {show && (
        <span style={{
          position: 'absolute',
          bottom: '120%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#1a1410',
          color: '#fff',
          padding: '5px 10px',
          borderRadius: 6,
          fontSize: 12,
          fontFamily: "'Nunito',sans-serif",
          fontWeight: 600,
          whiteSpace: 'nowrap',
          zIndex: 999,
          boxShadow: '0 4px 16px rgba(0,0,0,.25)',
          pointerEvents: 'none',
        }}>
          {word} = {meaning}
          <span style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '5px solid #1a1410',
          }} />
        </span>
      )}
    </span>
  )
}

function highlightWords(text: string, woordenlijst: Woord[]) {
  if (!woordenlijst || woordenlijst.length === 0) return <>{text}</>

  // Build a map of word → meaning (case insensitive)
  const wordMap = new Map<string, string>()
  woordenlijst.forEach(w => {
    wordMap.set(w.woord.toLowerCase(), w.betekenis)
  })

  // Split text into parts matching vocabulary words
  const words = text.split(/(\s+|[.,!?;:()"])/)
  
  return (
    <>
      {words.map((part, i) => {
        const clean = part.toLowerCase().replace(/[.,!?;:()"]/g, '')
        if (wordMap.has(clean)) {
          return <InlineWord key={i} word={part} meaning={wordMap.get(clean)!} />
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

export default function HomeClient({ artikels, wotd }: { artikels: Artikel[], wotd: WoordVanDeDag | null }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [levelFilter, setLevelFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [openGlossary, setOpenGlossary] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  const currentWotd = wotd || { woord: 'nieuws', definitie: 'news', voorbeeldzin: 'Ik lees het nieuws.' }
  const filtered = artikels.filter(a => {
    const matchLevel = levelFilter === 'all' || a.niveau === levelFilter
    const matchCat = categoryFilter === 'all' || a.categorie === categoryFilter
    return matchLevel && matchCat
  })
  const openArticle = artikels.find(a => a._id === openId)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function speakText(text: string) {
    if (!window.speechSynthesis) {
      showToast('Spraak niet beschikbaar in deze browser.')
      return
    }
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
      showToast('Gestopt.')
      return
    }

    // Wait for voices to load (important for Edge)
    const speak = () => {
      const utter = new SpeechSynthesisUtterance(text)
      utter.lang = 'nl-NL'
      utter.rate = 0.85
      utter.pitch = 1

      const voices = window.speechSynthesis.getVoices()

      // Edge has the best Dutch voices — prioritize them
      const preferred = [
        'Microsoft Roos Online (Natural) - Dutch (Netherlands)',
        'Microsoft Roos - Dutch (Netherlands)',
        'Microsoft Dena Online (Natural) - Dutch (Netherlands)',
      ]

      let chosenVoice = null
      for (const name of preferred) {
        chosenVoice = voices.find(v => v.name === name) || null
        if (chosenVoice) break
      }

      // Fallback to any Dutch voice
      if (!chosenVoice) {
        chosenVoice = voices.find(v => v.lang === 'nl-NL') ||
                      voices.find(v => v.lang.startsWith('nl')) ||
                      null
      }

      if (chosenVoice) {
        utter.voice = chosenVoice
        showToast(`▶ ${chosenVoice.name.includes('Roos') ? 'Roos' : 'Nederlandse stem'} leest voor…`)
      } else {
        showToast('▶ Aan het voorlezen…')
      }

      utter.onend = () => showToast('✓ Klaar met voorlezen.')
      utter.onerror = () => showToast('Fout bij voorlezen. Probeer opnieuw.')

      window.speechSynthesis.speak(utter)
    }

    // Voices may not be loaded yet — wait if needed
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      speak()
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        speak()
        window.speechSynthesis.onvoiceschanged = null
      }
    }
  }

  const categories = ['all', 'nederland', 'wereld', 'natuur', 'cultuur', 'sport', 'klimaat', 'economie', 'gezondheid']

  return (
    <>
      <style>{`
        .site-header{background:var(--surface);border-bottom:2px solid var(--ink);position:sticky;top:0;z-index:100;box-shadow:0 2px 12px rgba(30,27,23,.07)}
        .header-inner{max-width:1060px;margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;height:62px}
        .logo-title{font-family:'Fraunces',serif;font-size:22px;font-weight:700;letter-spacing:-.5px;cursor:pointer;color:var(--ink)}
        .logo-title span{color:var(--teal)}
        .logo-sub{font-family:'Nunito',sans-serif;font-size:10px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);margin-top:1px}
        .level-btn{font-family:'Nunito',sans-serif;font-size:11px;font-weight:700;letter-spacing:.1em;padding:5px 14px;border-radius:20px;border:2px solid transparent;cursor:pointer;transition:all .2s}
        .level-btn.all{background:transparent;color:var(--mid);border-color:var(--border)}
        .level-btn.all.active{border-color:var(--ink);color:var(--ink)}
        .level-btn.a2{background:var(--a2-bg);color:var(--a2-text);border-color:var(--a2-bg)}
        .level-btn.a2.active{border-color:var(--a2-text)}
        .level-btn.a2plus{background:#e0f0ec;color:#1a6b55;border-color:#e0f0ec}
        .level-btn.a2plus.active{border-color:#1a6b55}
        .level-badge.a2plus{background:#e0f0ec;color:#1a6b55}
        .level-btn.b1{background:var(--b1-bg);color:var(--b1-text);border-color:var(--b1-bg)}
        .level-btn.b1.active{border-color:var(--b1-text)}
        .cat-bar{background:var(--bg);border-bottom:1px solid var(--border);overflow-x:auto}
        .cat-bar-inner{max-width:1060px;margin:0 auto;padding:0 24px;display:flex;gap:2px;align-items:center;height:40px}
        .cat-btn{font-family:'Nunito',sans-serif;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:4px 12px;border-radius:20px;border:none;cursor:pointer;white-space:nowrap;transition:all .2s;background:transparent;color:var(--muted)}
        .cat-btn:hover{color:var(--teal)}
        .cat-btn.active{background:var(--teal);color:#fff}
        .article-card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:24px 26px;margin-bottom:16px;box-shadow:var(--shadow);transition:box-shadow .25s,transform .2s;animation:fadeUp .5s ease both}
        .article-card:hover{box-shadow:var(--shadow-lg);transform:translateY(-2px)}
        .card-title{font-family:'Fraunces',serif;font-size:22px;font-weight:600;line-height:1.25;letter-spacing:-.3px;margin-bottom:10px;cursor:pointer;color:var(--ink)}
        .card-title:hover{color:var(--teal)}
        .level-badge{font-family:'Nunito',sans-serif;font-size:10px;font-weight:700;letter-spacing:.12em;padding:3px 10px;border-radius:12px;text-transform:uppercase}
        .level-badge.a2{background:var(--a2-bg);color:var(--a2-text)}
        .level-badge.b1{background:var(--b1-bg);color:var(--b1-text)}
        .topic-tag{font-family:'Nunito',sans-serif;font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
        .read-time{font-size:10px;color:var(--muted);margin-left:auto}
        .card-body{font-size:15px;line-height:1.78;color:#3a3530;margin-bottom:14px}
        .card-footer{display:flex;align-items:center;gap:8px;padding-top:14px;border-top:1px solid var(--border);flex-wrap:wrap}
        .audio-btn{display:flex;align-items:center;gap:6px;background:var(--teal-light);color:var(--teal);border:1px solid var(--teal-mid);border-radius:20px;padding:5px 14px;font-family:'Nunito',sans-serif;font-size:11px;font-weight:700;cursor:pointer;transition:background .2s}
        .audio-btn:hover{background:#d0ede8}
        .words-btn{background:transparent;color:var(--amber);border:1px solid #f0d9b0;border-radius:20px;padding:5px 14px;font-family:'Nunito',sans-serif;font-size:11px;font-weight:700;cursor:pointer;transition:background .2s}
        .words-btn:hover{background:var(--amber-light)}
        .glossary-panel{background:var(--ink);color:#fff;border-radius:8px;padding:16px 18px;margin-top:12px;display:none}
        .glossary-panel.open{display:block}
        .main-wrap{max-width:1060px;margin:0 auto;padding:28px 24px 60px;display:grid;grid-template-columns:1fr 300px;gap:28px;align-items:start}
        .sidebar{display:flex;flex-direction:column;gap:16px}
        .sidebar-card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:18px 20px;box-shadow:0 2px 12px rgba(30,27,23,.06)}
        .sidebar-heading{font-family:'Nunito',sans-serif;font-size:10px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--teal);border-bottom:2px solid var(--teal-light);padding-bottom:8px;margin-bottom:14px}
        .section-heading{display:flex;align-items:center;gap:12px;margin-bottom:20px}
        .section-heading h2{font-family:'Nunito',sans-serif;font-size:11px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--muted);white-space:nowrap}
        .section-heading hr{flex:1;border:none;border-top:1px solid var(--border)}
        .wotd-bar{background:var(--amber-light);border-bottom:1px solid #f0d9b0;padding:10px 24px;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap}
        .toast-el{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(80px);background:var(--ink);color:#fff;padding:12px 22px;border-radius:24px;font-family:'Nunito',sans-serif;font-size:13px;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,.2);z-index:2000;transition:transform .35s cubic-bezier(.34,1.56,.64,1);white-space:nowrap}
        .toast-el.show{transform:translateX(-50%) translateY(0)}
        .article-img{width:100%;height:200px;object-fit:cover;border-radius:8px;margin-bottom:14px;display:block;cursor:pointer}
        .site-footer{background:var(--surface);border-top:1px solid var(--border);padding:20px 24px;margin-top:auto}
        .footer-inner{max-width:1060px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
        .footer-logo{font-family:'Fraunces',serif;font-size:16px;font-weight:700;color:var(--ink)}
        .footer-logo span{color:var(--teal)}
        .footer-links{display:flex;gap:20px;flex-wrap:wrap}
        .footer-link{font-size:13px;color:var(--mid);text-decoration:none;font-family:'Nunito',sans-serif;font-weight:600}
        .footer-link:hover{color:var(--teal)}
        .footer-copy{font-size:11px;color:var(--muted);font-family:'Nunito',sans-serif}
        @media(max-width:720px){.main-wrap{grid-template-columns:1fr}.sidebar{display:none}.cat-bar-inner{gap:0}}
      `}</style>

      {/* HEADER */}
      <header className="site-header">
        <div className="header-inner">
          <div onClick={() => { setOpenId(null); setCategoryFilter('all'); setLevelFilter('all') }} style={{ cursor: 'pointer' }}>
            <div className="logo-title">Nieuws<span>Leren</span></div>
            <div className="logo-sub">Eenvoudig Nederlands leren</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {['all', 'a2', 'a2plus', 'b1'].map(l => (
              <button key={l} className={`level-btn ${l} ${levelFilter === l ? 'active' : ''}`}
                onClick={() => { setLevelFilter(l); setOpenId(null) }}>
                {l === 'all' ? 'Alles' : l === 'a2plus' ? 'A2+' : l.toUpperCase()}
              </button>
            ))}
          </div>
          <a href="/contact" style={{ fontSize: 12, fontFamily: "'Nunito',sans-serif", fontWeight: 700, padding: '7px 16px', borderRadius: 20, border: '2px solid var(--border)', color: 'var(--mid)', textDecoration: 'none' }}>
            Contact
          </a>
        </div>

        {/* CATEGORY BAR */}
        <div className="cat-bar">
          <div className="cat-bar-inner">
            {categories.map(cat => (
              <button key={cat}
                className={`cat-btn ${categoryFilter === cat ? 'active' : ''}`}
                onClick={() => { setCategoryFilter(cat); setOpenId(null) }}>
                {cat === 'all' ? 'Alle categorieën' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* WORD OF THE DAY */}
      <div className="wotd-bar">
        <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--amber)' }}>Woord van de dag</span>
        <div style={{ width: 1, height: 16, background: '#d4b07a' }} />
        <span style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 600 }}>{currentWotd.woord}</span>
        <div style={{ width: 1, height: 16, background: '#d4b07a' }} />
        <span style={{ fontSize: 13, color: 'var(--mid)' }}>= {currentWotd.definitie} / <em style={{ fontStyle: 'italic', color: 'var(--amber)' }}>{currentWotd.voorbeeldzin}</em></span>
      </div>

      {/* MAIN */}
      <div className="main-wrap">
        <main>
          {openArticle ? (
            <div style={{ animation: 'fadeUp .4s ease' }}>
              <button onClick={() => setOpenId(null)}
                style={{ background: 'none', border: 'none', color: 'var(--muted)', fontFamily: "'Nunito',sans-serif", fontSize: 12, fontWeight: 600, cursor: 'pointer', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 4 }}>
                ← Terug naar nieuws
              </button>
              {openArticle.afbeelding?.url && (
                <img src={`${openArticle.afbeelding.url}?w=900&auto=format`}
                  alt={openArticle.afbeelding.alt || openArticle.kop}
                  style={{ width: '100%', height: 280, objectFit: 'cover', borderRadius: 8, marginBottom: 20, display: 'block' }} />
              )}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
                <span className={`level-badge ${openArticle.niveau === 'a2plus' ? 'a2plus' : openArticle.niveau || 'a2'}`}>
                  {openArticle.niveau === 'a2plus' ? 'A2+' : (openArticle.niveau || 'A2').toUpperCase()}
                </span>
                <span className="topic-tag">{openArticle.categorie}</span>
                {openArticle.leestijd && <span className="read-time">⏱ {openArticle.leestijd} min</span>}
                <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 'auto' }}>{formatDate(openArticle.datum)}</span>
              </div>
              <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-.5px', marginBottom: 16, color: 'var(--ink)' }}>
                {openArticle.kop}
              </h1>
              {openArticle.ondertitel && (
                <p style={{ fontSize: 16, color: 'var(--mid)', marginBottom: 20, lineHeight: 1.6 }}>{openArticle.ondertitel}</p>
              )}
              <div className="card-body">
                {openArticle.tekst && (
                  <PortableText
                    value={openArticle.tekst}
                    components={{
                      block: {
                        normal: ({ children, value }) => {
                          // Extract plain text from the block
                          const text = value.children
                            ?.map((child: any) => child.text || '')
                            .join('') || ''
                          return (
                            <p style={{ marginBottom: 14 }}>
                              {highlightWords(text, openArticle.woordenlijst || [])}
                            </p>
                          )
                        }
                      }
                    }}
                  />
                )}
              </div>
              <div className="card-footer" style={{ marginTop: 16 }}>
                <div style={{ width: '100%', background: 'var(--teal-light)', border: '1px solid var(--teal-mid)', borderRadius: 12, padding: '14px 16px', marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button onClick={() => speakText(getPlainText(openArticle.tekst))}
                    style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--teal)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background .2s' }}>
                    <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: '#fff' }}>
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                    </svg>
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, fontWeight: 700, color: 'var(--teal-dark)', marginBottom: 4 }}>
                      Lees voor — Nederlands
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--mid)', fontFamily: "'Nunito',sans-serif" }}>
                      Klik om het artikel te beluisteren · snelheid 0.85×
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--teal)', background: 'white', padding: '3px 8px', borderRadius: 8 }}>
                    NL
                  </div>
                </div>
                {openArticle.woordenlijst && openArticle.woordenlijst.length > 0 && (
                  <button className="words-btn"
                    onClick={() => setOpenGlossary(openGlossary === openArticle._id ? null : openArticle._id)}>
                    📖 Woordenlijst
                  </button>
                )}
              </div>
                {openGlossary === openArticle._id && openArticle.woordenlijst && (
                  <div style={{ marginTop: 16, padding: '16px 18px', background: '#f0faf6', border: '1px solid #b5ddd6', borderRadius: 10 }}>
                    <h4 style={{ fontFamily: "'Nunito',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: 12 }}>
                      📖 Woorden in dit artikel — hover voor betekenis
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {openArticle.woordenlijst.map((w, i) => (
                        <WordChip key={i} woord={w.woord} betekenis={w.betekenis} />
                      ))}
                    </div>
                  </div>
                )}
            </div>
          ) : (
            <>
              <div className="section-heading">
                <h2>Nieuws van vandaag</h2><hr />
              </div>
              {filtered.length === 0 && (
                <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--muted)', fontFamily: "'Nunito',sans-serif" }}>
                  Geen artikelen gevonden.
                </div>
              )}
              {filtered.map(a => (
                <article key={a._id} className="article-card">
                  {a.afbeelding?.url && (
                    <img src={`${a.afbeelding.url}?w=800&auto=format`}
                      alt={a.afbeelding.alt || a.kop}
                      className="article-img"
                      onClick={() => setOpenId(a._id)} />
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                    <span className={`level-badge ${a.niveau === 'a2plus' ? 'a2plus' : a.niveau || 'a2'}`}>
                        {a.niveau === 'a2plus' ? 'A2+' : a.niveau === 'a2plus' ? 'A2+' : (a.niveau || 'A2').toUpperCase()}
                    </span>
                    <span className="topic-tag">{a.categorie}</span>
                    {a.leestijd && <span className="read-time">⏱ {a.leestijd} min</span>}
                  </div>
                  <h2 className="card-title" onClick={() => setOpenId(a._id)}>{a.kop}</h2>
                  {a.ondertitel && (
                    <p className="card-body" style={{ marginBottom: 10 }}>
                      {highlightWords(a.ondertitel, a.woordenlijst || [])}
                    </p>
                  )}
                  <div className="card-footer">
                    <button className="audio-btn" onClick={() => speakText(a.kop + '. ' + (a.ondertitel || ''))}>
                      <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, fill: 'var(--teal)', flexShrink: 0 }}>
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                      </svg>
                      Lees voor
                    </button>
                    {a.woordenlijst && a.woordenlijst.length > 0 && (
                      <button className="words-btn"
                        onClick={() => setOpenGlossary(openGlossary === a._id ? null : a._id)}>
                        📖 Woordenlijst
                      </button>
                    )}
                  </div>
                    {openGlossary === a._id && a.woordenlijst && (
                      <div style={{ marginTop: 12, padding: '14px 16px', background: '#f0faf6', border: '1px solid #b5ddd6', borderRadius: 10 }}>
                        <h4 style={{ fontFamily: "'Nunito',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: 10 }}>
                          📖 Woorden — hover voor betekenis
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {a.woordenlijst.map((w, i) => (
                            <WordChip key={i} woord={w.woord} betekenis={w.betekenis} />
                          ))}
                        </div>
                      </div>
                    )}
                </article>
              ))}
            </>
          )}
        </main>

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-card">
            <div className="sidebar-heading">Over deze site</div>
            <p style={{ fontSize: 13, color: 'var(--mid)', lineHeight: 1.7 }}>
              Elke dag nieuws in eenvoudig Nederlands. Speciaal voor A2 en B1 leerders. Lees, luister en leer nieuwe woorden!
            </p>
          </div>

          <div className="sidebar-card">
            <div className="sidebar-heading">Recent nieuws</div>
            {artikels.slice(0, 3).map(a => (
              <div key={a._id} onClick={() => setOpenId(a._id)}
                style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.4 }}>{a.kop}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{a.categorie} · {formatDate(a.datum)}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="sidebar-card">
            <div className="sidebar-heading">Woord van de dag</div>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: 'var(--teal)', marginBottom: 6 }}>{currentWotd.woord}</div>
            <div style={{ fontSize: 13, color: 'var(--mid)', marginBottom: 6 }}>{currentWotd.definitie}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', background: 'var(--teal-light)', padding: '8px 10px', borderRadius: 6 }}>{currentWotd.voorbeeldzin}</div>
          </div>

          <div className="sidebar-card">
            <div className="sidebar-heading">Niveaus</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ background: 'var(--a2-bg)', borderRadius: 8, padding: '10px 12px' }}>
                <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, fontWeight: 700, color: 'var(--a2-text)' }}>A2 — Basis</span>
                <p style={{ fontSize: 12, color: 'var(--mid)', marginTop: 3 }}>Korte, eenvoudige zinnen voor beginners.</p>
              </div>
              <div style={{ background: 'var(--b1-bg)', borderRadius: 8, padding: '10px 12px' }}>
                <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, fontWeight: 700, color: 'var(--b1-text)' }}>B1 — Gevorderd</span>
                <p style={{ fontSize: 12, color: 'var(--mid)', marginTop: 3 }}>Langere teksten voor gevorderde leerders.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <div className="footer-logo">Nieuws<span>Leren</span></div>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2, fontFamily: "'Nunito',sans-serif", letterSpacing: '.1em', textTransform: 'uppercase' }}>
              Eenvoudig Nederlands leren · A2, A2+, B1
            </div>
          </div>
          <div className="footer-links">
            <a href="/" className="footer-link">Home</a>
            <a href="/contact" className="footer-link">Contact</a>
            <a href="/privacy" className="footer-link">Privacybeleid</a>
          </div>
          <div className="footer-copy">© {new Date().getFullYear()} NieuwsLeren.nl</div>
        </div>
      </footer>

      {/* FEEDBACK BUTTON */}
      <a href="https://tally.so/r/EkZD0N"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'var(--teal)',
          color: '#fff',
          fontFamily: "'Nunito',sans-serif",
          fontSize: 13,
          fontWeight: 700,
          padding: '10px 18px',
          borderRadius: 24,
          textDecoration: 'none',
          boxShadow: '0 4px 20px rgba(26,122,94,.4)',
          zIndex: 900,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
        💬 Feedback
      </a>

      {/* TOAST */}
      <div className={`toast-el ${toast ? 'show' : ''}`}>{toast}</div>
    </>
  )
}