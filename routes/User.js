import express from "express"
import * as dotenv from "dotenv"
import { loginUser, resetPassword, sendResetLink } from "../controllers/userControllers.js"
import { verifyUser } from "../middleware/verifyUser.js"

dotenv.config()


export const UserRouter= express.Router()


UserRouter.post("/login",loginUser)

UserRouter.post("/sendResetPassword",sendResetLink)
UserRouter.route(`/resetPassword/:token`).put(verifyUser,resetPassword)

