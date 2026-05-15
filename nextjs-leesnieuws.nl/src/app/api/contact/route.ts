import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resendApiKey = process.env.RESEND_API_KEY
const receiveEmail = process.env.RECEIVE_EMAIL
const resend = new Resend(resendApiKey ?? '')

export async function POST(req: Request) {
  if (!resendApiKey || !receiveEmail) {
    return NextResponse.json(
      { error: 'E-mailservice is niet geconfigureerd.' },
      { status: 500 }
    )
  }
  try {
    const { naam, email, bericht } = await req.json()

    if (!naam || !email || !bericht) {
      return NextResponse.json({ error: 'Vul alle velden in.' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'NieuwsLeren <onboarding@resend.dev>',
      to: receiveEmail,
      subject: `Nieuw bericht van ${naam}`,
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px">
          <h2 style="color:#2a7f6f;margin-bottom:16px">Nieuw bericht via NieuwsLeren.nl</h2>
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
          <p style="margin-top:24px;font-size:12px;color:#9a9088">Verzonden via NieuwsLeren.nl contactformulier</p>
        </div>
      `,
      replyTo: email,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Er ging iets mis. Probeer opnieuw.' }, { status: 500 })
  }
}