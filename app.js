import express from "express"
import * as dotenv from "dotenv"
import { db } from "./db/db.js"
import { CodesRouter } from "./routes/code.js"
import { UserRouter } from "./routes/User.js"
import swaggerJSDoc from "swagger-jsdoc"
import multer from 'multer';
dotenv.config()
const app=express()
app.use(express.json())
app.use(express.static("../temps"));

// app.use(checkTokenExpiry)
//Login

app.use("/api/codes",CodesRouter)
app.use("/api/users",UserRouter)//Check back on this
app.use("/api/sendEmail",UserRouter)
app.use("/api/registerSchool",UserRouter)
app.use("/api/schoolDetails",UserRouter)
app.use("/api/register_E-user",UserRouter)
app.use("/api/login",UserRouter)
// app.use("c",UserRouter)
app.use("/api/updatepassword",UserRouter)
app.use("/api/updateSchoolProfile",UserRouter)
app.use("/api/changeSchoolname",UserRouter)
app.use("/api/changeSchoolpassword",UserRouter)
app.use("/api/createHistory",UserRouter)
app.use("/api/getHistory",UserRouter)
app.use("/api/resend",UserRouter)
app.use("/api/sendcomplex",UserRouter)
app.use("/api/WesendCustomEmail",UserRouter)
app.use("/api/addSchoolLevel",UserRouter)
app.use("/api/deleteLevel",UserRouter)
app.use("/api/schoolProfile",UserRouter)




const port=8080
app.listen(port,async()=>{
   await db()
    console.log(`running on ${port}  `);
})