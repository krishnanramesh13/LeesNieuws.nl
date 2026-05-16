require('dotenv').config()
const Groq = require('groq-sdk').default
const { createClient } = require('@sanity/client')
const { Resend } = require('resend')
const Parser = require('rss-parser')
const config = require('./config')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const sanity = createClient({
  projectId: '6idcxy5u',
  dataset: 'production',
  apiVersion: '2026-05-13',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})
const resend = new Resend(process.env.RESEND_API_KEY)
const parser = new Parser()

// ── FETCH NEWS ──
async function fetchNews() {
  console.log('📰 Fetching Dutch news...')
  const articles = []
  const enabledSources = config.sources.filter(s => s.enabled)
  console.log(`📡 Active sources: ${enabledSources.map(s => s.name).join(', ')}`)

  for (const source of enabledSources) {
    try {
      const parsed = await parser.parseURL(source.url)
      const items = parsed.items.slice(0, source.articlesPerFeed)
      for (const item of items) {
        articles.push({
          title: item.title || '',
          content: item.contentSnippet || item.summary || item.title || '',
          link: item.link || '',
          source: source.name,
          defaultCategory: source.defaultCategory,
        })
      }
      console.log(`  ✅ ${source.name}: ${items.length} articles`)
    } catch (e) {
      console.log(`  ⚠️ Failed: ${source.name} — ${e.message}`)
    }
  }

  // Shuffle so we get variety
  return articles.sort(() => Math.random() - 0.5)
}

// ── REWRITE A2 ──
async function rewriteA2(article) {
  console.log(`✍️ [A2] Rewriting: ${article.title}`)

  const prompt = `Je bent een creatieve Nederlandse taalleraar die nieuws herschrijft voor A2 beginners.

Origineel artikel: "${article.title}"
Originele tekst: "${article.content}"

Herschrijf dit als een leuk, verhalend nieuwsstuk voor A2 taalleerders. Schrijf het als een verhaal dat begint met een situatie, dan wat er gebeurde, en dan het resultaat. Maak het boeiend en leerzaam.

Geef ALLEEN dit JSON terug (geen markdown):
{
  "kop": "Korte, pakkende kop (max 8 woorden)",
  "ondertitel": "Één zin die nieuwsgierig maakt (max 12 woorden)",
  "niveau": "a2",
  "categorie": "één van: nederland, wereld, natuur, cultuur, sport, klimaat, economie, gezondheid",
  "leestijd": 2,
  "tekst": [
    "Zin 1: Stel de situatie voor. Gebruik eenvoudige woorden.",
    "Zin 2: Wat gebeurde er precies? Vertel het als een verhaal.",
    "Zin 3: Wie is erbij betrokken en waarom is het belangrijk?",
    "Zin 4: Wat vinden de mensen ervan? Of wat zegt een expert?",
    "Zin 5: Hoe eindigt het verhaal? Wat gebeurt er nu?"
  ],
  "woordenlijst": [
    {"woord": "werkwoord1", "betekenis": "to [english verb]", "type": "verb"},
    {"woord": "werkwoord2", "betekenis": "to [english verb]", "type": "verb"},
    {"woord": "werkwoord3", "betekenis": "to [english verb]", "type": "verb"},
    {"woord": "werkwoord4", "betekenis": "to [english verb]", "type": "verb"},
    {"woord": "zelfstandignaamwoord1", "betekenis": "english meaning", "type": "noun"},
    {"woord": "zelfstandignaamwoord2", "betekenis": "english meaning", "type": "noun"},
    {"woord": "zelfstandignaamwoord3", "betekenis": "english meaning", "type": "noun"},
    {"woord": "zelfstandignaamwoord4", "betekenis": "english meaning", "type": "noun"},
    {"woord": "bijvoeglijknaamwoord1", "betekenis": "english meaning", "type": "adjective"},
    {"woord": "bijvoeglijknaamwoord2", "betekenis": "english meaning", "type": "adjective"}
  ]
}

REGELS voor A2:
- EXACT 5 zinnen in tekst array — niet meer, niet minder
- Elke zin max 10 woorden
- Gebruik ALLEEN heel gewone Nederlandse woorden
- Schrijf als een boeiend verhaal, niet als droog nieuws
- EXACT 10 woorden in woordenlijst: 4 werkwoorden + 4 zelfstandige naamwoorden + 2 bijvoeglijke naamwoorden
- Alle woorden moeten uit het artikel komen
- Geef ALLEEN JSON terug`

  const response = await groq.chat.completions.create({
    model: config.groq.model,
    messages: [{ role: 'user', content: prompt }],
    temperature: config.groq.temperature,
    max_tokens: config.groq.maxTokens,
  })

  const text = response.choices[0].message.content.trim()
  const clean = text.replace(/```json|```/g, '').trim()
  const parsed = JSON.parse(clean)
  parsed._niveau = 'a2'
  return parsed
}

// ── REWRITE A2+ ──
async function rewriteA2Plus(article) {
  console.log(`✍️ [A2+] Rewriting: ${article.title}`)

  const prompt = `Je bent een Nederlandse taalleraar die nieuws schrijft voor A2+ taalleerders. Dit is een niveau tussen A2 en B1 — iets moeilijker dan A2 maar nog niet zo complex als B1.

Origineel artikel: "${article.title}"
Originele tekst: "${article.content}"

Herschrijf dit als een boeiend nieuwsverhaal voor A2+ taalleerders. Gebruik wat langere zinnen dan A2 maar blijf toegankelijk. Voeg wat meer context en details toe.

Geef ALLEEN dit JSON terug (geen markdown):
{
  "kop": "Pakkende kop (max 10 woorden)",
  "ondertitel": "Informatieve ondertitel die nieuwsgierig maakt (max 15 woorden)",
  "niveau": "a2plus",
  "categorie": "één van: nederland, wereld, natuur, cultuur, sport, klimaat, economie, gezondheid",
  "leestijd": 3,
  "tekst": [
    "Zin 1: Introduceer de situatie met wat context. Gebruik max 12 woorden.",
    "Zin 2: Vertel wat er precies is gebeurd. Geef een detail. Max 12 woorden.",
    "Zin 3: Wie is erbij betrokken en wat is de achtergrond? Max 12 woorden.",
    "Zin 4: Wat zijn de gevolgen of reacties? Gebruik een citaat of mening. Max 12 woorden.",
    "Zin 5: Wat betekent dit voor de toekomst? Sluit het verhaal af. Max 12 woorden.",
    "Zin 6: Extra context of interessant detail dat het verhaal compleet maakt. Max 12 woorden.",
    "Zin 7: Conclusie of vooruitblik. Wat kunnen we verwachten? Max 12 woorden."
  ],
  "woordenlijst": [
    {"woord": "werkwoord1", "betekenis": "to [english verb]", "type": "verb"},
    {"woord": "werkwoord2", "betekenis": "to [english verb]", "type": "verb"},
    {"woord": "werkwoord3", "betekenis": "to [english verb]", "type": "verb"},
    {"woord": "zelfstandignaamwoord1", "betekenis": "english meaning", "type": "noun"},
    {"woord": "zelfstandignaamwoord2", "betekenis": "english meaning", "type": "noun"},
    {"woord": "zelfstandignaamwoord3", "betekenis": "english meaning", "type": "noun"},
    {"woord": "bijvoeglijknaamwoord1", "betekenis": "english meaning", "type": "adjective"},
    {"woord": "uitdrukking1", "betekenis": "english meaning + short explanation", "type": "uitdrukking"}
  ]
}

REGELS voor A2+:
- EXACT 7 zinnen in tekst array
- Zinnen zijn iets langer dan A2 maar max 12 woorden
- Gebruik gewone Nederlandse woorden maar voeg 2-3 iets moeilijkere woorden toe
- Schrijf als een boeiend verhaal met meer details dan A2
- EXACT 8 woorden in woordenlijst: 3 werkwoorden + 3 zelfstandige naamwoorden + 1 bijvoeglijk naamwoord + 1 uitdrukking
- Geef ALLEEN JSON terug`

  const response = await groq.chat.completions.create({
    model: config.groq.model,
    messages: [{ role: 'user', content: prompt }],
    temperature: config.groq.temperature,
    max_tokens: config.groq.maxTokens,
  })

  const text = response.choices[0].message.content.trim()
  const clean = text.replace(/```json|```/g, '').trim()
  const parsed = JSON.parse(clean)
  parsed._niveau = 'a2plus'
  return parsed
}

// ── REWRITE B1 ──
async function rewriteB1(article) {
  console.log(`✍️ [B1] Rewriting: ${article.title}`)

  const prompt = `Je bent een Nederlandse taalleraar die gevorderd nieuws schrijft voor B1 taalleerders.

Origineel artikel: "${article.title}"
Originele tekst: "${article.content}"

Herschrijf dit als een uitgebreid, informatief nieuwsartikel voor B1 taalleerders. Gebruik wat moeilijkere woorden en typisch Nederlandse uitdrukkingen. Maak het journalistiek en informatief maar toch toegankelijk.

Geef ALLEEN dit JSON terug (geen markdown):
{
  "kop": "Journalistieke kop (max 10 woorden)",
  "ondertitel": "Informatieve ondertitel (max 15 woorden)",
  "niveau": "b1",
  "categorie": "één van: nederland, wereld, natuur, cultuur, sport, klimaat, economie, gezondheid",
  "leestijd": 4,
  "tekst": [
    "Alinea 1: Inleiding — wat is er aan de hand? (2-3 zinnen)",
    "Alinea 2: Achtergrond — waarom is dit belangrijk? (2-3 zinnen)",
    "Alinea 3: Details — wat zijn de feiten en cijfers? (2-3 zinnen)",
    "Alinea 4: Reacties — wat zeggen betrokkenen? (2-3 zinnen)",
    "Alinea 5: Gevolgen — wat betekent dit voor mensen? (2-3 zinnen)"
  ],
  "woordenlijst": [
    {"woord": "moeilijk woord 1", "betekenis": "english meaning", "type": "word"},
    {"woord": "moeilijk woord 2", "betekenis": "english meaning", "type": "word"},
    {"woord": "moeilijk woord 3", "betekenis": "english meaning", "type": "word"},
    {"woord": "moeilijk woord 4", "betekenis": "english meaning", "type": "word"},
    {"woord": "moeilijk woord 5", "betekenis": "english meaning", "type": "word"},
    {"woord": "uitdrukking 1", "betekenis": "english meaning + explanation", "type": "uitdrukking"},
    {"woord": "uitdrukking 2", "betekenis": "english meaning + explanation", "type": "uitdrukking"}
  ]
}

REGELS voor B1:
- EXACT 5 alinea's in tekst array — elke alinea is 2-3 zinnen als één string
- Gebruik wat moeilijkere maar gangbare Nederlandse woorden
- Schrijf journalistiek maar toegankelijk
- Gebruik typische Nederlandse uitdrukkingen waar mogelijk
- EXACT 7 items in woordenlijst: 5 moeilijke woorden + 2 uitdrukkingen
- Geef ALLEEN JSON terug`

  const response = await groq.chat.completions.create({
    model: config.groq.model,
    messages: [{ role: 'user', content: prompt }],
    temperature: config.groq.temperature,
    max_tokens: config.groq.maxTokens,
  })

  const text = response.choices[0].message.content.trim()
  const clean = text.replace(/```json|```/g, '').trim()
  const parsed = JSON.parse(clean)
  parsed._niveau = 'b1'
  return parsed
}

// ── SAVE TO SANITY AS DRAFT ──
async function saveToDraft(article) {
  console.log(`💾 Saving draft [${article.niveau}]: ${article.kop}`)

  const blocks = article.tekst.map((paragraph) => ({
    _type: 'block',
    _key: Math.random().toString(36).substr(2, 9),
    style: 'normal',
    markDefs: [],
    children: [{
      _type: 'span',
      _key: Math.random().toString(36).substr(2, 9),
      text: paragraph,
      marks: [],
    }],
  }))

  const doc = {
    _type: 'artikel',
    _id: `drafts.pipeline-${article.niveau}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    kop: article.kop,
    ondertitel: article.ondertitel,
    niveau: article.niveau || 'a2',
    categorie: article.categorie || 'nederland',
    leestijd: article.leestijd || 2,
    datum: new Date().toISOString(),
    tekst: blocks,
    woordenlijst: article.woordenlijst.map((w) => ({
      _type: 'object',
      _key: Math.random().toString(36).substr(2, 9),
      woord: w.woord,
      betekenis: w.betekenis,
    })),
  }

  await sanity.createOrReplace(doc)
  return { title: doc.kop, niveau: article.niveau }
}

// ── SEND EMAIL ──
async function sendNotification(saved) {
  if (!config.notification.sendEmail) return
  console.log('📧 Sending notification...')

    const a2Articles = saved.filter(a => a.niveau === 'a2')
    const a2PlusArticles = saved.filter(a => a.niveau === 'a2plus')
    const b1Articles = saved.filter(a => a.niveau === 'b1')

    // ← ADD THIS FUNCTION HERE
    const makeList = (items) => items.map((a, i) => `
        <tr>
        <td style="padding:7px 12px;border-bottom:1px solid #e4ddd4;font-size:13px">${i + 1}</td>
        <td style="padding:7px 12px;border-bottom:1px solid #e4ddd4;font-size:13px">${a.title}</td>
        </tr>`).join('')

    await resend.emails.send({
    from: 'NieuwsLeren Pipeline <info@nieuwsleren.nl>',
    to: process.env.RECEIVE_EMAIL,
    subject: `✅ ${saved.length} artikelen klaar — ${a2Articles.length}× A2 + ${a2PlusArticles.length}× A2+ + ${b1Articles.length}× B1`,
    html: `
        <div style="font-family:sans-serif;max-width:580px;margin:0 auto;padding:24px">
        <div style="background:#1a7a5e;padding:20px 24px;border-radius:10px 10px 0 0;text-align:center">
            <h1 style="color:#fff;margin:0;font-size:22px">NieuwsLeren Pipeline</h1>
            <p style="color:rgba(255,255,255,.75);margin:6px 0 0;font-size:13px">${new Date().toLocaleDateString('nl-NL', { weekday:'long', day:'numeric', month:'long' })}</p>
        </div>
        <div style="background:#fdfaf5;border:1px solid #e4ddd4;border-top:none;padding:24px;border-radius:0 0 10px 10px">
            <p style="font-size:15px;margin:0 0 20px;color:#1a1410">
            🎉 <strong>${saved.length} nieuwe artikelen</strong> staan klaar als draft!
            </p>

            <div style="background:#ddf2ec;border-radius:8px;padding:12px 16px;margin-bottom:12px">
            <div style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#1a7a5e;margin-bottom:8px">A2 — Basis (${a2Articles.length} artikelen)</div>
            <table style="width:100%;border-collapse:collapse">${makeList(a2Articles)}</table>
            </div>

            <div style="background:#e8f4f1;border-radius:8px;padding:12px 16px;margin-bottom:12px">
            <div style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#1a6b55;margin-bottom:8px">A2+ — Tussenniveau (${a2PlusArticles.length} artikelen)</div>
            <table style="width:100%;border-collapse:collapse">${makeList(a2PlusArticles)}</table>
            </div>

            <div style="background:#fff0d4;border-radius:8px;padding:12px 16px;margin-bottom:20px">
            <div style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#8a5200;margin-bottom:8px">B1 — Gevorderd (${b1Articles.length} artikelen)</div>
            <table style="width:100%;border-collapse:collapse">${makeList(b1Articles)}</table>
            </div>

            <a href="https://nieuwsleren.sanity.studio"
            style="display:block;text-align:center;background:#1a7a5e;color:#fff;padding:13px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px">
            📝 Open Sanity Studio →
            </a>
        </div>
        </div>
    `,
    })
}

// ── MAIN ──
async function main() {
  console.log('🚀 Starting NieuwsLeren pipeline...')
  console.log(`📅 ${new Date().toLocaleDateString('nl-NL')}`)
  console.log(`⚙️  A2: ${config.pipeline.totalA2Articles} articles | B1: ${config.pipeline.totalB1Articles} articles`)

  try {
    // 1. Fetch all news
    const news = await fetchNews()
    console.log(`✅ Total fetched: ${news.length} articles`)
    if (news.length === 0) { console.log('❌ No articles. Exiting.'); return }

    // 2. Split into A2, A2+ and B1 batches
    const a2News = news.slice(0, config.pipeline.totalA2Articles)
    const a2PlusNews = news.slice(
    config.pipeline.totalA2Articles,
    config.pipeline.totalA2Articles + config.pipeline.totalA2PlusArticles
    )
    const b1News = news.slice(
    config.pipeline.totalA2Articles + config.pipeline.totalA2PlusArticles,
    config.pipeline.totalA2Articles + config.pipeline.totalA2PlusArticles + config.pipeline.totalB1Articles
    )

    // 3. Rewrite A2 articles
    console.log('\n📗 Processing A2 articles...')
    const a2Rewritten = []
    for (const article of a2News) {
    try {
        const result = await rewriteA2(article)
        a2Rewritten.push(result)
        await new Promise(r => setTimeout(r, config.pipeline.delayBetweenArticles))
    } catch (e) {
        console.log(`⚠️ A2 failed: ${article.title} — ${e.message}`)
    }
    }

    // 4. Rewrite A2+ articles
    console.log('\n📙 Processing A2+ articles...')
    const a2PlusRewritten = []
    for (const article of a2PlusNews) {
    try {
        const result = await rewriteA2Plus(article)
        a2PlusRewritten.push(result)
        await new Promise(r => setTimeout(r, config.pipeline.delayBetweenArticles))
    } catch (e) {
        console.log(`⚠️ A2+ failed: ${article.title} — ${e.message}`)
    }
    }

    // 5. Rewrite B1 articles
    console.log('\n📘 Processing B1 articles...')
    const b1Rewritten = []
    for (const article of b1News) {
    try {
        const result = await rewriteB1(article)
        b1Rewritten.push(result)
        await new Promise(r => setTimeout(r, config.pipeline.delayBetweenArticles))
    } catch (e) {
        console.log(`⚠️ B1 failed: ${article.title} — ${e.message}`)
    }
    }

    console.log(`\n✅ Rewrote: ${a2Rewritten.length} A2 + ${a2PlusRewritten.length} A2+ + ${b1Rewritten.length} B1`)

    // 6. Save all to Sanity as drafts
    console.log('\n💾 Saving to Sanity...')
    const saved = []
    for (const article of [...a2Rewritten, ...a2PlusRewritten, ...b1Rewritten]) {
    try {
        const result = await saveToDraft(article)
        saved.push(result)
    } catch (e) {
        console.log(`⚠️ Save failed: ${article.kop} — ${e.message}`)
    }
    }

    // 6. Send email
    if (saved.length > 0) {
      await sendNotification(saved)
      console.log('✅ Email sent!')
    }

    console.log('\n🎉 Pipeline complete!')
    console.log(`📊 Summary: ${saved.filter(a=>a.niveau==='a2').length} A2 + ${saved.filter(a=>a.niveau==='b1').length} B1 drafts saved`)

  } catch (e) {
    console.error('❌ Pipeline failed:', e)
    process.exit(1)
  }
}

main()