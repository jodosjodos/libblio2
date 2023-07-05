import { Resend } from "resend";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

export const UserSendsEmail = async (req, res) => {
  try {
    const { user_email, fullname, subject, message } = req.body;
    const data = await resend.emails.send({
      from: "support@libblio.com",
      to: "support@libblio.com",
      subject: subject,
      text: `From: ${fullname}\n${user_email}\n\n${message}`,
    });

    console.log(data);
    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message:
        "Failed to send email. Please check your Internet connection and try again.",
      error: error.message,
    });
  }
};
