import express from "express"
import * as dotenv from "dotenv"
import { db } from "./db/db.js"
import { CodesRouter } from "./routes/code.js"
import { UserRouter } from "./routes/User.js"
dotenv.config()

const app=express()
app.use(express.json())

app.use("/api/codes",CodesRouter)
app.use("/api/users",UserRouter)

const port =process.env.port || 4000
app.listen(port,async()=>{
   await db()
    console.log(`running on ${port}  `);
})