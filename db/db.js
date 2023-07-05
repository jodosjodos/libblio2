import mongoose from "mongoose";
import * as dotenv from "dotenv"
dotenv.config()

const mongoUrl=process.env.MONGO_URL

export const db=async()=>{
    try {
      const connection= await mongoose.connect(mongoUrl)
    if(connection){
        console.log('connected successfully,');
    }
    return connection
    } catch (error) {
        console.log(error);
    }
}

