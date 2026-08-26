import { resendApiKey, transporter, senderAddress } from "./email.config.js";
import { Verification_Email_Template } from "../libs/email.tamplate.js";

export const sendVerficationCode = async (email, verificationCode) => {
  try {
    const subject = "Your Verification Code";
    const text = `Your Verification Code is ${verificationCode}`;
    const html = Verification_Email_Template.replace("{verificationCode}", verificationCode);

    if (resendApiKey) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from: senderAddress, to: [email], subject, text, html }),
      });

      if (!response.ok) {
        const details = await response.text();
        throw new Error(`Resend API ${response.status}: ${details}`);
      }

      const result = await response.json();
      console.log("Message sent:", result.id);
      return result;
    }

    const info = await transporter.sendMail({
      from: `"Petition Management (Civic)" <${senderAddress}>`,
      to: email,
      subject,
      text,
      html,
    });
    console.log("Message sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email send error:", error.message);
    throw error;
  }
};