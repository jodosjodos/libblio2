/**
 * @swagger
 * /login-codes:
 *   post:
 *     summary: Login with codes
 *     description: Authenticate with codes
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: example_user
 *               password: example_password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Success message
 *       401:
 *         description: Unauthorized
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
import bcrypt from "bcrypt";
import CreateError from "http-errors";
import { StatusCodes } from "http-status-codes";
dotenv.config();
const hashedCodesPassword = await bcrypt.hash(process.env.CODERS_PASSWORD, 10);
const compareFunction = async ({ username, password }, res) => {
  const matchPassword = await bcrypt.compare(password, hashedCodesPassword);
  if (!matchPassword) {
    throw CreateError.Unauthorized("You have provided invalid credentials");
  }
  if (username !== process.env.CODERS_USERNAME) {
    throw CreateError.Unauthorized("Invalid credentials");
  }
  return res.status(StatusCodes.OK).json({ msg: "Login has succeeded" });
};
export const loginCodes = async (req, res) => {
  try {
    const { username, password } = req.body;
    await compareFunction({ username, password }, res);
  } catch (error) {
    res.json(error);
  }
};
