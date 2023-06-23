import express from "express"
import * as dotenv from "dotenv"
dotenv.config()
import { loginCodes } from "../controllers/codesContollers.js"

export const CodesRouter= express.Router()

// console.log(process.env.HIDDEN);
CodesRouter.post(`/${process.env.HIDDEN}`,loginCodes)
