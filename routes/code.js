import express from "express"
import * as dotenv from "dotenv"
dotenv.config()
import { loginCodes } from "../controllers/codesContollers.js"

export const CodesRouter= express.Router()

CodesRouter.post(`/${process.env.HIDDEN}`,loginCodes)
