function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

function getLogoUrl() {
  const frontendUrl = process.env.FRONTEND_URL;
  if (!frontendUrl) {
    throw new Error("FRONTEND_URL is required to generate the email logo URL.");
  }

  return new URL("/Plexshity-io.png", frontendUrl).href;
}

function renderEmailBrand(logoUrl, wordmarkColor) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
  <tr>
    <td style="padding-right:12px;">
      <img src="${logoUrl}" alt="" width="44" height="44" style="display:block;width:44px;height:44px;">
    </td>
    <td style="font-size:14px;font-weight:bold;letter-spacing:1px;color:${wordmarkColor};">
      PLEXSHITY
    </td>
  </tr>
</table>`;
}

export function createWelcomeEmail(fullname, verificationUrl) {
  const safeFullname = escapeHtml(fullname);
  const safeVerificationUrl = escapeHtml(verificationUrl);
  const safeLogoUrl = escapeHtml(getLogoUrl());

  return {
    subject: "Welcome to Plexshity",
    text: `Hi ${fullname},

Welcome to Plexshity. We're glad you're here.

Plexshity helps you explore questions and find useful answers in one place. We're excited to be part of your journey.

Account verification
Verify your email address using this link:
${verificationUrl}

This link expires in 1 hour. If it expires, request another verification email from Plexshity.

If you didn't create this account, you can safely ignore this email.

The Plexshity team`,
    html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Welcome to Plexshity</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#17202a;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f6f8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid #e6e9ed;border-radius:12px;">
            <tr>
              <td style="padding:36px 40px 24px;">
                ${renderEmailBrand(safeLogoUrl, "#2457d6")}
                <h1 style="margin:0 0 16px;font-size:28px;line-height:1.3;color:#17202a;">Welcome, ${safeFullname}!</h1>
                <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#46515c;">We're glad you're here. Plexshity helps you explore questions and find useful answers in one place.</p>
                <p style="margin:0;font-size:16px;line-height:1.6;color:#46515c;">We're excited to be part of your journey.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f5f8ff;border-radius:8px;">
                  <tr>
                    <td style="padding:20px 24px;">
                      <h2 style="margin:0 0 8px;font-size:16px;color:#17202a;">Account verification</h2>
                      <p style="margin:0;font-size:14px;line-height:1.6;color:#46515c;">Please verify your email address to finish setting up your account. This link expires in 1 hour; if it expires, request another verification email from Plexshity.</p>
                      <p style="margin:20px 0 0;">
                        <a href="${safeVerificationUrl}" style="display:inline-block;padding:12px 20px;background-color:#2457d6;border-radius:6px;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;">Verify email address</a>
                      </p>
                      <p style="margin:16px 0 0;font-size:12px;line-height:1.6;color:#697581;">If the button doesn't work, copy and paste this link into your browser:<br><a href="${safeVerificationUrl}" style="color:#2457d6;word-break:break-all;">${safeVerificationUrl}</a></p>
                    </td>
                  </tr>
                </table>
                <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#697581;">If you didn't create this account, you can safely ignore this email.</p>
                <p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:#46515c;">The Plexshity team</p>
              </td>
            </tr>
          </table>
          <p style="margin:16px 0 0;font-size:12px;color:#87919b;">&copy; Plexshity</p>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  };
}

export function createVerificationEmail(fullName, verificationUrl) {
  const safeFullName = escapeHtml(fullName);
  const safeVerificationUrl = escapeHtml(verificationUrl);
  const safeLogoUrl = escapeHtml(getLogoUrl());

  return {
    subject: "Your Plexshity verification link",
    text: `Hi ${fullName},

Use this link to verify your email address and finish setting up your Plexshity account:
${verificationUrl}

This link expires in 1 hour. If it expires, request another verification email from Plexshity.

If you didn't create this account, you can safely ignore this email.`,
    html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Verify your Plexshity email</title>
  </head>
  <body style="margin:0;padding:32px 16px;background-color:#0d0f16;font-family:Arial,Helvetica,sans-serif;color:#eeedf1;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="480" style="width:100%;max-width:480px;background-color:#191c26;border:1px solid #30313b;border-radius:16px;">
            <tr>
              <td style="padding:36px 32px;">
                ${renderEmailBrand(safeLogoUrl, "#eeedf1")}
                <h1 style="margin:0 0 12px;font-size:24px;line-height:1.3;color:#eeedf1;">Verify your email</h1>
                <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#a4a5b0;">Hi ${safeFullName}, use the button below to verify your email and finish setting up your account. This link expires in 1 hour; if it expires, request another verification email from Plexshity.</p>
                <p style="margin:0 0 24px;">
                  <a href="${safeVerificationUrl}" style="display:inline-block;padding:13px 20px;background-color:#b7a5cb;border-radius:10px;color:#211d28;font-size:14px;font-weight:bold;text-decoration:none;">Verify email</a>
                </p>
                <p style="margin:0;font-size:12px;line-height:1.6;color:#a4a5b0;">If you didn't create this account, you can safely ignore this email.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  };
}
