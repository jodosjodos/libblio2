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
    res.json(error)
  }
};
