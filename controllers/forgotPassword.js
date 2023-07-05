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

import jwt from "jsonwebtoken";

export const forgotPassword = async (req, res) => {
  try {
    const { emailAddress,schoolName } = req.body;
    
    let user = await School.findOne({ librarianEmail: emailAddress });
    if (!user) {
      user = await User.findOne({ email: emailAddress });
    }
    if (!user) {
      console.log("User was not found with that email");
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    const schoolOfUser=user.schoolName;

    const newToken = jwt.sign({ email: emailAddress }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const templatePath = path.resolve(__dirname, "../tempos/Resetpass.html");
    const emailContent = await promisify(fs.readFile)(templatePath, "utf-8"); 
    const userData = emailContent
    .replace("{{schoolName}}",schoolOfUser);
    const redirectLink=`https://libblio.com/resetPasswordpage/${newToken}`
   

   

    // const emailContent = `We have received a password reset request for your account. Click ${newToken} to reset your password.`;
    // const emailContentWithToken = emailContent.replace(emailContent, "{{token}}", newToken);
    await sendResetEmail(emailAddress, "[Reset your Libblio Credentials]", userData);
    
    res.status(201).json("Success in Sending Reset Email");
  } catch (error) {
    console.log(error);
  }
};


const sendResetEmail = async (emailAddress, subject,emailContent) => {
  try {
    const data = await resend.emails.send({
      from: "Libblio Support <support@libblio.com>",
      to: emailAddress,
      subject,
      html: emailContent,
    });
    console.log(data);
  } catch (error) {
    console.error( error);
    throw error;
  }
};


export const checkTokenAndReset = async (req, res) => {
  try {
    const { tokenbyFrontend, newPassword } = req.body;
    const token = tokenbyFrontend;
    const emailFromToken =await decryptTokenAndGetEmail(token);//since the decrypt function is Returning email
    // console.log(emailFromToken);
    let user = await School.findOne({ librarianEmail: emailFromToken });

    if (user) {
      user.password = newPassword;
      await user.save();
      res.status(200).json("Password was updated successfully");
    } else {
      user = await User.findOne({ email: emailFromToken });
      if (user) {
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.status(200).json("Password was updated successfully");
      } else {
        console.log("User was not found with that email");
        return res.status(401).json({ error: "Invalid Token, User Was NOt Found" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

  const decryptTokenAndGetEmail = async (frontendToken) => {
    try {
      const decodedToken = await jwt.verify(frontendToken, process.env.JWT_SECRET);
      // const { email } = decodedToken;
      // console.log(decodedToken);
      return decodedToken.email;
    } catch (error) {
      console.error(error);
      throw new Error("Token decryption failed");
    }
  };












