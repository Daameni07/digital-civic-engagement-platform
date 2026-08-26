import { transporter, senderAddress } from "./email.config.js";
import { Verification_Email_Template } from "../libs/email.tamplate.js";

export const sendVerficationCode = async (email, verificationCode) => {
  try {
    const subject = "Your Verification Code";
    const text = `Your Verification Code is ${verificationCode}`;
    const html = Verification_Email_Template.replace("{verificationCode}", verificationCode);

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