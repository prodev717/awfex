import nodemailer from "nodemailer";

let transporter;

function getTransporter(user, pass) {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass,
      },
    });
  }
  return transporter;
}

export async function gmail(
  userEmail,
  appPassword,
  tos,
  subjects,
  texts = null,
  html = null
) {
  const mailTransporter = getTransporter(userEmail, appPassword);

  const toArray = Array.isArray(tos) ? tos : [tos];
  const subjectArray = Array.isArray(subjects) ? subjects : [subjects];
  const textArray =
    texts === null ? [] : Array.isArray(texts) ? texts : [texts];
  const htmlArray = html === null ? [] : Array.isArray(html) ? html : [html];

  const results = [];

  for (let i = 0; i < toArray.length; i++) {
    const to = toArray[i];

    const subject =
      subjectArray.length === 1 ? subjectArray[0] : subjectArray[i];

    const text =
      textArray.length === 0
        ? null
        : textArray.length === 1
        ? textArray[0]
        : textArray[i];

    const htmlContent =
      htmlArray.length === 0
        ? null
        : htmlArray.length === 1
        ? htmlArray[0]
        : htmlArray[i];

    // Allow text-only, html-only, or both
    if (!to || (!text && !htmlContent)) {
      results.push({
        success: false,
        to,
        error: "Recipient missing or both text and HTML are empty",
      });
      continue;
    }

    const mailOptions = {
      from: userEmail,
      to,
      subject,
      ...(text ? { text } : {}),
      ...(htmlContent ? { html: htmlContent } : {}),
    };

    try {
      const info = await mailTransporter.sendMail(mailOptions);
      results.push({
        success: true,
        to,
        messageId: info.messageId,
        response: info.response,
      });
    } catch (error) {
      results.push({
        success: false,
        to,
        error: error.message,
      });
    }
  }

  return {
    success: results.every((r) => r.success),
    results,
  };
}

export const gmailDescription = `
gmail(userEmail, appPassword, tos, subjects, texts, html):
- Sends one or more emails using Gmail SMTP via Nodemailer.
- Supports broadcast and pairwise sending.
- Supports text-only, HTML-only, or text + HTML emails.
- Uses Gmail App Password authentication.

Parameters:
  userEmail: String — Your Gmail address.
  appPassword: String — Gmail App Password.
  tos: String | Array — Recipient email(s).
  subjects: String | Array — Subject(s).
  texts: String | Array | null — Plain text body/bodies.
  html: String | Array | null — HTML body/bodies.

Behavior:
  - One subject/text/html + many recipients → broadcast
  - tos[i] + subjects[i] + texts[i] + html[i] → paired send
  - At least one of text or html must be provided per email

Returns:
  Object —
    success: Boolean
    results: Array of per-email results
`;

export const gmailMetadata = {
  parameters: ["User Email", "App Password", "To", "Subject", "Text", "HTML"],
  icon: "/icons/gmail.png",
  hasVariableParams: false,
};
