import { StatusCodes } from "http-status-codes";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import.meta.url;
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/e-users.model.js";

dotenv.config();

const generateToken = async (id) => {
  const token = await jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return token;
};

//End of Transporter Configurations

// User Sends us Email

export const resetPassword = async (req, res) => {
  try {
    const { id } = req.user;

    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate(
      { _id: id },
      { password: hashedPassword }
    );
    if (!user) {
      res.status(StatusCodes.BAD_REQUEST).json({ err: " some errors" });
    }
    res
      .status(StatusCodes.OK)
      .json({ msg: "password has been updated successfully" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

export const sendResetLink = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ msg: "user with this email  not found" });
    }

    const userFound = await User.find({ email });
    console.log(userFound);
    if (userFound.length == 0) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ err: "eamil not found" });
    }
    const id = userFound[0]._id;

    const token = await generateToken(id);
    const resetLink = `http://localhost:8000/resetPassword/${token}`;
    let emailContent = html.replace("{{resetLink}}", resetLink);

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      template: "email",
      subject: "sending email for password reset",
      Content: {
        title: ` the token is   http://localhost:8000/resetPassword/${token}`,
        fullame: "jodos2006",
      },
      html: emailContent,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        return res
          .status(StatusCodes.SERVICE_UNAVAILABLE)
          .send({ err: "email not sent" });
      } else {
        if (info) {
          res
            .status(StatusCodes.CREATED)
            .send({ msg: "email sent successfully" });
        }
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ err: err });
  }
};

//Login Here of the User

export const loginUser = async (req, res) => {
  try {
    const { schoolName, role, password } = req.body;
    const user = await User.findOne({ schoolName: schoolName, role: role });
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ err: "invalid credentials" });
    }

    const authorizedUser = await bcrypt.compare(password, user.password);
    if (!authorizedUser) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ err: "invalid credentials " });
    }
    return res
      .status(StatusCodes.OK)
      .json({ msg: "u have logged in successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ err: "internal serve error 🥹" });
  }
};








export const forgotPassword = async (req, res) => {
  try {
    const { emailAddress } = req.body;

    let user = await School.findOne({ librarianEmail: emailAddress });
    if (!user) {
      user = await User.findOne({ email: emailAddress });
    }

    if (!user) {
      console.log("User was not found with that email");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const emailContent = `We have Received A reset Password on your Account click here to  Reset`;

    await sendResetEmail(
      emailAddress,
      "[Reset e-Library Credentials]",
      emailContent
    );

    res.status(201).json("Success in Sending Reset Email");
  } catch (error) {}
};

const sendResetEmail = async (emailAddress, subject, Content) => {
  try {
    const our_email = process.env.EMAIL;
    const mailOptions = {
      from: our_email,
      to: emailAddress,
      subject,
      text: Content, //Rember to Change it to html
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    // Handle email sending errors
    console.error("Error sending email:", error);
    throw new Error("Failed to send email.");
  }
};

export const checkTokenAndReset = async (req, res) => {
  try {
    const { emailAddress, newPassword, token } = req.body;

    const newToken = jwt.sign({ email: emailAddress }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const schoolUser = await School.findOne({ librarianEmail: emailAddress });
    const normalUser = await User.findOne({ email: emailAddress });

    if (!schoolUser && !normalUser) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    if (schoolUser) {
      const decryptedEmail = decryptTokenAndGetEmail(token);
      if (decryptedEmail !== emailAddress) {
        console.log("Email verification failed");
        return res.status(401).json({ error: "Email verification failed" });
      }

      schoolUser.password = await bcrypt.hash(newPassword, 10);
      await schoolUser.save();
    }
    if (normalUser) {
      const decryptedEmail = decryptTokenAndGetEmail(token);
      if (decryptedEmail !== emailAddress) {
        console.log("Email verification failed");
        return res.status(401).json({ error: "Email verification failed" });
      }
      normalUser.password = await bcrypt.hash(newPassword, 10);
      await normalUser.save();
    }

    return res.status(200).json({ token: newToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
//i want to get the new token from the returned one
const decryptTokenAndGetEmail = (newtoken) => {
  try {
    const decodedToken = jwt.verify(newtoken, process.env.JWT_SECRET);
    const { email } = decodedToken;
    return email;
  } catch (error) {
    console.error(error);
    throw new Error("Token decryption failed");
  }
};
