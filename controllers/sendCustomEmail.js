/**
 * @swagger
 * /custom-email:
 *   post:
 *     summary: Send custom email
 *     description: Send a custom email to the specified recipient
 *     tags:
 *       - Email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               toEmail:
 *                 type: string
 *               dear:
 *                 type: string
 *               messageTitle:
 *                 type: string
 *               emailSignature:
 *                 type: string
 *               mssge:
 *                 type: string
 *               preview:
 *                 type: string
 *               subject:
 *                 type: string
 *             example:
 *               toEmail: recipient@example.com
 *               dear: Dear recipient
 *               messageTitle: Example Title
 *               emailSignature: Example Signature
 *               mssge: Example Message
 *               preview: Example Preview
 *               subject: Example Subject
 *     responses:
 *       401:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Success message
 */
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import.meta.url;
import { Resend } from "resend";
import fs from "fs";
dotenv.config();
import { promisify } from "util"; 
const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);
  
export const sendOurCustomEmail=async (req,res)=>{
  try{
    const { toEmail, dear, messageTitle,emailSignature,mssge,preview,subject} = req.body;
    
    const __filename = fileURLToPath(import.meta.url);
          const __dirname = path.dirname(__filename);
          const templatePath = path.resolve(__dirname, "../tempos/Custom.html");
          const emailContent = await promisify(fs.readFile)(templatePath, "utf-8"); 
          const userData = emailContent
          .replace("{{schoolName}}",dear)
          .replace("{{emailSignature}}",emailSignature)
          .replace("{{messageTitle}}",messageTitle)
          .replace("{{message}}",mssge)
          .replace("{{preview}}",preview)
        
          await sendNotifyingEmail(toEmail, subject, userData);
          return res.status(401).json({ error: "Message sent successfully" });

  }catch(error){
    console.error("Error in creating a new User",error);
  }  
}  

const sendNotifyingEmail = async (school_email, subject, emailContent) => {
  try {
    const data = await resend.emails.send({
      from: "Libblio Support <support@libblio.com>",
      to: school_email,
      subject:subject,
      html: emailContent,
    });
    console.log(data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};




    