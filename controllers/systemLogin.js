/**
 * @swagger
 * /system-login:
 *   post:
 *     summary: System login
 *     description: Authenticate a user for system login
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inputEmail:
 *                 type: string
 *               password:
 *                 type: string
 *               rememberMe:
 *                 type: boolean
 *             example:
 *               inputEmail: user@example.com
 *               password: password123
 *               rememberMe: true
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: User ID
 *                 token:
 *                   type: string
 *                   description: Authentication token
 *       401:
 *         description: Invalid credentials or user is blocked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
import * as dotenv from "dotenv";
import.meta.url;
dotenv.config();
import _ from "lodash";
import { School } from "../models/school.model.js";
import { User } from "../models/e-users.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const SystemLogin = async (req, res) => {
  try {
    const { inputEmail, password, rememberMe } = req.body;

    let user = await School.findOne({ librarianEmail: inputEmail });
    if (!user) {
      user = await User.findOne({ email: inputEmail });
    }

    if (!user) {
      console.log("User was not found with that email");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      console.log("Invalid password");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.isBlocked) {
      console.log("User is blocked");
      return res.status(401).json({ error: "User is blocked" });
    }

    const token = jwt.sign(
      _.pick(user, ["_id", "school", "role", "isBlocked"]),
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? "90d" : "1d" }
    );

    console.log(token);

    return res.status(200).json(_.pick(user, ["_id", "token"]));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
