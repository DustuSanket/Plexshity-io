import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 20_000,
  auth: {
    type: "OAuth2",
    user: process.env.GOOGLE_USER,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    clientId: process.env.GOOGLE_CLIENT_ID,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

transporter
  .verify()
  .then(() => {
    console.log("Email service is ready");
  })
  .catch((err) => {
    console.error("Email service failed", err);
  });

export async function sendEmail({ to, subject, html, text }) {
  const mailOption = {
    from: process.env.GOOGLE_USER,
    to,
    subject,
    html,
    text,
  };

  const details = await transporter.sendMail(mailOption);
  console.log("Mail transported: ", details);
}
