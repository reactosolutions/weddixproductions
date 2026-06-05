import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, service, message, source = 'contact_page' } = body

  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  const { error: dbError } = await supabase.from('contact_submissions').insert({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    service: service?.trim() || null,
    message: message?.trim() || null,
    source,
  })

  if (dbError) {
    console.error('Supabase insert error:', dbError)
    return NextResponse.json({ error: 'Failed to save your inquiry. Please try again.' }, { status: 500 })
  }

  const { data: settingsRow } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'contact_page')
    .single()

  let recipient = process.env.CONTACT_RECIPIENT_EMAIL!
  if (settingsRow?.value) {
    try {
      const parsed = JSON.parse(settingsRow.value)
      if (parsed.notification_email) recipient = parsed.notification_email
    } catch { /* fall through to env var */ }
  }

  const { error: emailError } = await resend.emails.send({
    from: process.env.CONTACT_SENDER_EMAIL!,
    to: recipient,
    subject: `New inquiry from ${name}${service ? ` — ${service}` : ''}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#2A1018">
        <h2 style="color:#8B1535;margin-bottom:24px">New Contact Inquiry</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;font-weight:600;width:120px">Name</td><td>${name}</td></tr>
          <tr><td style="padding:8px 0;font-weight:600">Email</td><td><a href="mailto:${email}" style="color:#8B1535">${email}</a></td></tr>
          ${service ? `<tr><td style="padding:8px 0;font-weight:600">Service</td><td>${service}</td></tr>` : ''}
          ${message ? `<tr><td style="padding:8px 0;font-weight:600;vertical-align:top">Message</td><td style="white-space:pre-wrap">${message}</td></tr>` : ''}
        </table>
      </div>
    `,
  })

  if (emailError) {
    console.error('Resend error:', emailError)
    // Submission was saved — don't fail the request over email
  }

  return NextResponse.json({ success: true })
}
