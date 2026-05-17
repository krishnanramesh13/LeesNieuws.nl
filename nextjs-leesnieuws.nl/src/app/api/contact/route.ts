import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

// ── RATE LIMITING ──
const rateLimit = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const hour = 60 * 60 * 1000
  const requests = rateLimit.get(ip) || []
  const recent = requests.filter(t => now - t < hour)
  if (recent.length >= 3) return true
  rateLimit.set(ip, [...recent, now])
  return false
}

// ── VALIDATION ──
function validateInput(naam: string, email: string, bericht: string): string | null {
  if (!naam || naam.trim().length < 2) return 'Naam is te kort.'
  if (naam.length > 100) return 'Naam is te lang.'
  if (!email || !email.includes('@') || !email.includes('.')) return 'Ongeldig e-mailadres.'
  if (email.length > 200) return 'E-mailadres is te lang.'
  if (!bericht || bericht.trim().length < 10) return 'Bericht is te kort (minimaal 10 tekens).'
  if (bericht.length > 2000) return 'Bericht is te lang (maximaal 2000 tekens).'
  return null
}

export async function POST(req: Request) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') ||
               req.headers.get('x-real-ip') ||
               'unknown'
    
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Te veel berichten. Probeer over een uur opnieuw.' },
        { status: 429 }
      )
    }

    const { naam, email, bericht } = await req.json()

    // Validate
    const validationError = validateInput(naam, email, bericht)
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    // Send email
    await resend.emails.send({
      from: 'NieuwsLeren <info@nieuwsleren.nl>',
      to: process.env.RECEIVE_EMAIL!,
      subject: `Nieuw bericht van ${naam}`,
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px">
          <h2 style="color:#1a7a5e;margin-bottom:16px">Nieuw bericht via NieuwsLeren.nl</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr style="border-bottom:1px solid #e4ddd4">
              <td style="padding:10px 0;font-weight:700;color:#5a5248;width:100px">Naam</td>
              <td style="padding:10px 0;color:#1e1b17">${naam}</td>
            </tr>
            <tr style="border-bottom:1px solid #e4ddd4">
              <td style="padding:10px 0;font-weight:700;color:#5a5248">E-mail</td>
              <td style="padding:10px 0;color:#1e1b17">${email}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;font-weight:700;color:#5a5248;vertical-align:top">Bericht</td>
              <td style="padding:10px 0;color:#1e1b17;line-height:1.6">${bericht.replace(/\n/g, '<br/>')}</td>
            </tr>
          </table>
          <p style="margin-top:24px;font-size:12px;color:#9a9088">
            Verzonden via NieuwsLeren.nl contactformulier<br/>
            IP: ${ip}
          </p>
        </div>
      `,
      replyTo: email,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json(
      { error: 'Er ging iets mis. Probeer opnieuw.' },
      { status: 500 }
    )
  }
}