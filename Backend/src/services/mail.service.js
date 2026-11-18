import { BrevoClient } from "@getbrevo/brevo";

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
  timeoutInSeconds: 15,
});

export async function sendEmail({ to, subject, html, text }) {
  if (!process.env.BREVO_API_KEY || !process.env.FROM_EMAIL) {
    throw new Error("BREVO_API_KEY and FROM_EMAIL must be configured");
  }

  try {
    const response = await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: "noReply@Plexshity.io",
        email: process.env.FROM_EMAIL,
      },
      to: (Array.isArray(to) ? to : [to]).map((email) => ({ email })),
      subject,
      htmlContent: html,
      ...(text ? { textContent: text } : {}),
    });

    console.log("Email sent:", response.messageId);
    return response;
  } catch (error) {
    console.error("Email service failed:", error);
    throw error;
  }
}
