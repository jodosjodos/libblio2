import mongoose, { Schema }  from "mongoose";

const codesSchema= new Schema({
    username: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true

    }
})


export const Codes =mongoose.model("LoginCodes",codesSchema)