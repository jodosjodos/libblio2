import express from "express"
import * as dotenv from "dotenv"
import { loginUser, resetPassword, sendResetLink} from "../controllers/userControllers.js"
import { createSchool } from "../controllers/createSchool.js";
import { getAllSchools } from "../controllers/Allschools.js";
import { SystemLogin } from "../controllers/systemLogin.js";
import { createUser } from "../controllers/createUser.js";
import { UserSendsEmail } from "../controllers/UserSendsEmail.js";
import { forgotPassword } from "../controllers/forgotPassword.js";
import { checkTokenAndReset } from "../controllers/forgotPassword.js";
import { updateSchoolName } from "../controllers/updateSchoolName.js";
import { updatePassword } from "../controllers/updateSchoolPassword.js";
import { createHistoryEntry } from "../controllers/createHisory.js";
import { getAllHistoryEntries } from "../controllers/getHistory.js";
import { sendEmailsInBackgroundJob } from "../controllers/ArrayEmail.js";
import { sendOurCustomEmail } from "../controllers/sendCustomEmail.js";
import { createLevel } from "../controllers/SystemLevels.js";
import { deleteLevel } from "../controllers/deleteLevel.js";
import { uploadProfilePicture } from "../controllers/profileSchool.js";
dotenv.config()


export const UserRouter= express.Router()


UserRouter.post("/login",loginUser)//This is for our Admin Dashbaord
UserRouter.post("/sendResetPassword",sendResetLink)
//-------------------------------------------------------
// UserRouter.route(`/resetPassword/:token`).put(verifyUser,resetPassword)
UserRouter.post("/sendMessage",UserSendsEmail)  
UserRouter.post("/welcomingEmail",createSchool)
UserRouter.get("/allSchools",getAllSchools)
UserRouter.post("/createUser",createUser)
UserRouter.post("/loginUser",SystemLogin)
UserRouter.post("/SendCustomEmail",sendOurCustomEmail)
UserRouter.post("/userForgetsPassword",forgotPassword)
UserRouter.patch("/changeForgottenPass",checkTokenAndReset)
UserRouter.patch("/updateSchoolName",updateSchoolName)
UserRouter.patch("/updateSchoolPassword",updatePassword)
UserRouter.post("/createHistoryEndpoint",createHistoryEntry)
UserRouter.get("/Allhistory",getAllHistoryEntries)
UserRouter.post("/addLevel",createLevel)
UserRouter.post("/complexsend",sendEmailsInBackgroundJob)
UserRouter.delete("/deleteLevel/:levelId",deleteLevel)
UserRouter.post("/uplaodpicture/:schoolId",uploadProfilePicture)


