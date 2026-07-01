import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_k7ar1zg";
const TEMPLATE_ID = "template_3ktwn7c";

export type ContactEmailPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export async function sendContactEmail(payload: ContactEmailPayload) {
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  if (!publicKey) {
    throw new Error("EmailJS public key is missing. Add NEXT_PUBLIC_EMAILJS_PUBLIC_KEY to .env.local");
  }

  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      name: payload.name,
      email: payload.email,
      phone: "Not provided",
      company_name: payload.subject,
      company: payload.subject,
      conmpany_name: payload.subject,
      subject: payload.subject,
      message: payload.message,
      reply_to: payload.email,
    },
    { publicKey }
  );
}
