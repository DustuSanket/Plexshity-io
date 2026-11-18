import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html, text }) {
  const { data, error } = await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    text,
  });

  if (error) {
    console.error("Email service failed:", error);
    throw new Error(`Email delivery failed: ${error.message}`);
  }

  console.log("Email sent:", data?.id);
  return data;
}
