/**
 * @swagger
 * /schools:
 *   post:
 *     summary: Create a new school
 *     description: Create a new school with the provided details
 *     tags:
 *       - Schools
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               schoolName:
 *                 type: string
 *               role:
 *                 type: string
 *               schoolEmail:
 *                 type: string
 *               librarianEmail:
 *                 type: string
 *               password:
 *                 type: string
 *               location:
 *                 type: string
 *               type:
 *                 type: string
 *             example:
 *               schoolName: Example School
 *               role: Librarian
 *               schoolEmail: school@example.com
 *               librarianEmail: librarian@example.com
 *               password: examplePassword
 *               location: Example Location
 *               type: Example Type
 *     responses:
 *       201:
 *         description: School created successfully
 *       400:
 *         description: Failure in registering a new school
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
import { Resend } from "resend";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import.meta.url;
import bcrypt from "bcrypt";
dotenv.config();
import path from "path";
import fs from "fs";
const resendApiKey = process.env.Resend;
const resend = new Resend(resendApiKey);

export const createSchool = async (req, res) => {
  try {
    const{
      schoolName,
      role,
      schoolEmail,
      librarianEmail,
      password,
      location,
      type,
    } = req.body;

    
    const hashedPassword = await bcrypt.hash(password, 10);
    const schoolDetails = {
      schoolName,
      librarianEmail,
      schoolEmail,
      role,
      location,
      type,
      password: hashedPassword,
      isBlocked: false,
    };
    const existingSchool = await School.findOne({
      $or: [{ librarianEmail }, { schoolEmail }],
    });
    if (existingSchool) {
      return res.status(401).json({ error: "One of the emails already exist" });
    }
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const templatePath = path.resolve(__dirname, "../tempos/WelcomeSchool.html");
    const emailContent = fs.readFileSync(templatePath, "utf-8");
    const schoolData = emailContent
  .replace("{{schoolName}}", schoolName)
  .replace("{{librarianEmail}}", librarianEmail)
  .replace("{{role}}", role)
  .replace("{{password}}", password);


    try {
      let createdSchool
      createdSchool = await School.create(schoolDetails);
      const emailPromises = [
        sendWelcomingEmail(
          librarianEmail,
          "Your Libblio Credentials",
          schoolData,
          res
        ),
        sendWelcomingEmail(
          schoolEmail,
          "Your Libblio Credentials",
          schoolData,
          res
        ),
      ];

      await Promise.all(emailPromises);
      res.status(201).json("A new School has been Created");
    } catch (error) {
      console.error("Error creating school:", error);
      return res
        .status(400)
        .json({ error: "Failure in registering a new school" });
    }
  } catch (error) {
    console.error("Error in Creating School: ", error);
  }
 
};


const sendWelcomingEmail = async (toEmail, subject, emailContent, res) => {
  try {

    const data = await resend.emails.send({
      from: "Libblio Support <support@libblio.com>",
      to: toEmail,
      subject,
      html: emailContent,
    });
    console.log(data);
  } catch (error) {
    console.error(error);
    throw error
  }
};
