'use client'

export default function PrivacyPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: "'Nunito Sans',sans-serif" }}>

      {/* HEADER */}
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

      {/* CONTENT */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 80px' }}>

        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontFamily: "'Nunito',sans-serif", fontWeight: 600, color: 'var(--muted)', textDecoration: 'none', marginBottom: 28 }}>
          ← Terug naar nieuws
        </a>

        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 34, fontWeight: 700, letterSpacing: '-.5px', color: 'var(--ink)', marginBottom: 8 }}>
          Privacybeleid
        </h1>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 40, fontFamily: "'Nunito',sans-serif" }}>
          Laatst bijgewerkt: mei 2026
        </p>

        {[
          {
            title: '1. Wie zijn wij?',
            content: `DagelijksNieuws.nl is een website waarop dagelijks nieuws wordt gepubliceerd in eenvoudig Nederlands, speciaal voor A2 en B1 taalleerders. De website is gevestigd in Leeuwarden, Nederland. Voor vragen over dit privacybeleid kun je contact opnemen via het contactformulier op onze website.`
          },
          {
            title: '2. Welke gegevens verzamelen wij?',
            content: `Wij verzamelen zo min mogelijk persoonsgegevens. De enige gegevens die wij ontvangen zijn de gegevens die jij zelf invult in ons contactformulier: jouw naam, e-mailadres en het bericht dat je stuurt. Wij slaan deze gegevens niet op in een database. Ze worden alleen gebruikt om jouw vraag te beantwoorden.`
          },
          {
            title: '3. Waarvoor gebruiken wij jouw gegevens?',
            content: `De gegevens uit het contactformulier gebruiken wij uitsluitend om te reageren op jouw bericht. Wij gebruiken jouw gegevens niet voor marketingdoeleinden, wij verkopen jouw gegevens niet aan derden en wij delen jouw gegevens niet met andere partijen, behalve met Resend (onze e-mailprovider) die het bericht doorstuurt naar ons e-mailadres.`
          },
          {
            title: '4. Cookies',
            content: `DagelijksNieuws.nl maakt momenteel geen gebruik van tracking cookies of advertentiecookies. Wij gebruiken geen Google Analytics of andere trackingdiensten. Als wij in de toekomst cookies gaan gebruiken, zullen wij dit privacybeleid bijwerken en jouw toestemming vragen.`
          },
          {
            title: '5. Derde partijen',
            content: `Onze website maakt gebruik van de volgende externe diensten:\n\n• Sanity.io — voor het beheren van artikelinhoud. Sanity slaat alleen de inhoud van artikelen op, geen persoonsgegevens van bezoekers.\n\n• Resend — voor het verzenden van e-mails via het contactformulier. Resend verwerkt tijdelijk de gegevens die je invult in het contactformulier.\n\n• Google Fonts — voor het laden van lettertypen. Google kan hierbij jouw IP-adres verwerken. Meer informatie vind je in het privacybeleid van Google.`
          },
          {
            title: '6. Jouw rechten (AVG/GDPR)',
            content: `Op grond van de Algemene Verordening Gegevensbescherming (AVG) heb je de volgende rechten:\n\n• Recht op inzage — je kunt opvragen welke gegevens wij van jou hebben.\n• Recht op correctie — je kunt onjuiste gegevens laten corrigeren.\n• Recht op verwijdering — je kunt vragen jouw gegevens te verwijderen.\n• Recht op bezwaar — je kunt bezwaar maken tegen de verwerking van jouw gegevens.\n\nOm gebruik te maken van deze rechten, neem contact met ons op via het contactformulier.`
          },
          {
            title: '7. Beveiliging',
            content: `Wij nemen de beveiliging van jouw gegevens serieus. Onze website maakt gebruik van HTTPS-versleuteling. Wij bewaren jouw contactgegevens niet langer dan noodzakelijk is om jouw vraag te beantwoorden.`
          },
          {
            title: '8. Wijzigingen',
            content: `Wij behouden ons het recht voor dit privacybeleid te wijzigen. Wijzigingen worden gepubliceerd op deze pagina met een bijgewerkte datum. Wij raden je aan dit beleid regelmatig te raadplegen.`
          },
          {
            title: '9. Contact',
            content: `Heb je vragen over dit privacybeleid? Neem dan contact met ons op via het contactformulier op onze website. Wij reageren binnen 5 werkdagen.`
          },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: 36, paddingBottom: 36, borderBottom: i < 8 ? '1px solid var(--border)' : 'none' }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: 'var(--ink)', marginBottom: 12 }}>
              {section.title}
            </h2>
            <div style={{ fontSize: 15, color: 'var(--mid)', lineHeight: 1.8 }}>
              {section.content.split('\n\n').map((para, j) => (
                <p key={j} style={{ marginBottom: 10 }}>{para}</p>
              ))}
            </div>
          </div>
        ))}

        {/* CONTACT CTA */}
        <div style={{ background: 'var(--teal-light)', border: '1px solid var(--teal-mid)', borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--teal-dark)', marginBottom: 4 }}>Vragen over jouw privacy?</div>
            <div style={{ fontSize: 13, color: 'var(--mid)' }}>Wij helpen je graag. Stuur ons een bericht via het contactformulier.</div>
          </div>
          <a href="/contact" style={{ padding: '10px 20px', background: 'var(--teal)', color: '#fff', borderRadius: 8, fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Contact opnemen
          </a>
        </div>

      </div>
    </div>
  )
}