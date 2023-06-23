import { StatusCodes } from "http-status-codes";
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";

dotenv.config();
const template = path.resolve(__dirname, "../templates/index.html");

const html = fs.readFileSync(template, "utf-8");

const generateToken = async (id) => {
  const token = await jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return token;
};
let config = {
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
};
const transporter = nodemailer.createTransport(config);

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
