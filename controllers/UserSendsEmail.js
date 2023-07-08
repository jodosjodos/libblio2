/**
 * @swagger
 * /user-sends-email:
 *   post:
 *     summary: User sends email
 *     description: Send an email from a user to a recipient
 *     tags:
 *       - Email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_email:
 *                 type: string
 *               fullname:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *             example:
 *               user_email: john@example.com
 *               fullname: John Doe
 *               subject: Inquiry
 *               message: Hello, I have a question regarding your services.
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Success message
 *       500:
 *         description: Failed to send email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Error message
 *                 error:
 *                   type: string
 *                   description: Error details
 */
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
