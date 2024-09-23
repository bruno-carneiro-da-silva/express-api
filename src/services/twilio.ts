// src/services/sendgrid.ts
import sgMail from "@sendgrid/mail";

const sendGridApiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.FROM_EMAIL;

if (!sendGridApiKey) {
  throw new Error("SENDGRID_API_KEY is not defined");
}

if (!fromEmail) {
  throw new Error("FROM_EMAIL is not defined");
}

sgMail.setApiKey(sendGridApiKey);

export const sendEmail = (to: string, subject: string, body: string) => {
  const msg = {
    to,
    from: fromEmail, 
    subject,
    text: body,
    html: `<p>${body}</p>`,
  };

  return sgMail.send(msg);
};
