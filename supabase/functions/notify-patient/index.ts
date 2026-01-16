import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

declare const Deno: { env: { get: (key: string) => string | undefined } }

serve(async (req) => {
  const { record, old_record } = await req.json()

  // Only send email if the status actually changed
  if (record.status === old_record.status) {
    return new Response('No status change', { status: 200 })
  }

  const apiKey = Deno.env.get('RESEND_API_KEY')
  if (!apiKey) {
    return new Response('Missing RESEND_API_KEY environment variable', { status: 500 })
  }

  const patientEmail = record.patient_email
  const status = record.status
  const doctorName = record.doctor_name

  // Logic to send email via Resend/SendGrid/Postmark
  const message = status === 'confirmed' 
    ? `Great news! Your appointment with Dr. ${doctorName} has been confirmed for ${record.time}.`
    : `We're sorry, your appointment with Dr. ${doctorName} has been declined or needs to be rescheduled.`;

  // Example fetch to an email API
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: 'Hospital <notifications@yourdomain.com>',
      to: [patientEmail],
      subject: `Appointment ${status.toUpperCase()}`,
      html: `<strong>${message}</strong>`,
    }),
  })

  return new Response(JSON.stringify({ done: true }), { status: 200 })
})