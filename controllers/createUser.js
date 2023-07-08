/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user with the provided details
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               schoolId:
 *                 type: string
 *               role:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               schoolId: exampleSchoolId
 *               role: Student
 *               email: example@example.com
 *               password: examplePassword
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Failure in registering a new user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       401:
 *         description: One of the emails already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
import { School } from "../models/school.model.js";
import { User } from "../models/e-users.model.js";
import { Resend } from "resend";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs";
import { promisify } from "util"; 
dotenv.config();
const resendApiKey = process.env.RESEND_API_KEY;

const resend = new Resend(resendApiKey);


export const createUser = async (req, res) => {
  try {
    const { schoolId, role, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const school = await School.findById(schoolId);
    const userDetails = {
      school: schoolId,
      schoolName: school.schoolName,
      role,
      email,
      password: hashedPassword,
    };
    const asignedName=userDetails.schoolName;
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(401).json({ error: "One of the emails already exist" });
    }

    const toEmail = email; // You should define 'toEmail' variable before using it
    try{
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const templatePath = path.resolve(__dirname, "../tempos/WelcomeUser.html");
      const emailContent = await promisify(fs.readFile)(templatePath, "utf-8"); 
      const userData = emailContent
      .replace("{{schoolName}}",asignedName)
      .replace("{{role}}",role)
      .replace("{{email}}",email)
      .replace("{{password}}",password)
      
      await User.create(userDetails);
      await sendNotifyingEmail(toEmail, "Your Libblio Credentials", userData);

    }catch(error){
      console.error("Error creating new User:", error);
      return res.status(400).json({ error: "Failure in registering a new user" });
    }
    return res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error)
  }  
};  

/**
 * @swagger
 * /send-notifying-email:
 *   post:
 *     summary: Send a notifying email
 *     description: Send a notifying email to the provided email address
 *     tags:
 *       - Emails
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               subject:
 *                 type: string
 *               emailContent:
 *                 type: string
 *             example:
 *               email: user@example.com
 *               subject: Welcome to Libblio
 *               emailContent: <html><body>Welcome to Libblio!</body></html>
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       500:
 *         description: Error sending email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
const sendNotifyingEmail = async (email, subject, emailContent) => {
  try {
    const data = await resend.emails.send({
      from: "Libblio Support <support@libblio.com>",
      to: email,
      subject,
      html: emailContent,
    });
    console.log(data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};


