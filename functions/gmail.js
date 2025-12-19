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

export async function gmail(userEmail, appPassword, to, subject, text, html = null) {
    const mailTransporter = getTransporter(userEmail, appPassword);

    const mailOptions = {
        from: userEmail,
        to,
        subject,
        text,
        ...(html ? { html } : {}),
    };

    try {
        const info = await mailTransporter.sendMail(mailOptions);
        return {
            success: true,
            messageId: info.messageId,
            response: info.response,
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
}

export const gmailDescription = `
gmail(userEmail, appPassword, to, subject, text, html):
- Sends an email using Gmail via Nodemailer.
- Uses Gmail SMTP with App Password authentication.
- Supports plain text and optional HTML content.

Parameters:
  userEmail: String — Your Gmail address.
  appPassword: String — Gmail App Password (not your normal password).
  to: String — Recipient email address.
  subject: String — Email subject.
  text: String — Plain text email body.
  html: String (optional) — HTML email body.

Returns:
  Object —
    success: Boolean
    messageId: String (if successful)
    response: String
    error: String (if failed)
`;

export const gmailMetadata = {
    parameters: ["User Email", "App Password", "To", "Subject", "Text", "HTML"],
    icon: "/icons/gmail.png",
    hasVariableParams: false,
};
