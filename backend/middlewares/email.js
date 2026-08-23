import { transporter, senderAddress } from "./email.config.js";
import { Verification_Email_Template } from "../libs/email.tamplate.js";

export const sendVerficationCode = async (email, verificationCode) => {
  try {
    const info = await transporter.sendMail({
      from: `"Petition Management (Civic)" <${senderAddress}>`,
      to: email,
      subject: "Your Verification Code",
      text: `Your Verification Code is ${verificationCode}`,
      html: Verification_Email_Template.replace("{verificationCode}", verificationCode),
    });
    console.log("Message sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email send error:", error.message);
    throw error;
  }
};