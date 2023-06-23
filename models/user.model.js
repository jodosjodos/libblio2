import  mongoose from 'mongoose';
import  bcrypt  from 'bcrypt';
import  joi from 'joi'

const userValidationSchema = joi.object({
    schoolName:joi.string().max(50).required(),
    role:joi.string().valid('ADMIN','STUDENT').required(),
    email:joi.string().email().required(),
    password:joi.string().min(5).max(20).required(),
    confirmPassword: joi.string().valid(joi.ref('password')).required().messages({'any.only': 'Passwords do not match'}),
})
const userSchema = new mongoose.Schema({
    schoolName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['ADMIN', 'STUDENT'],
    },
    email:{
      type:String,
        required:true,
        unique:true,
    },
    password: {
      type: String,
      required: true,
    },
  });
userSchema.statics.signup= async function (userData) {
    const { error } = userValidationSchema.validate(userData);
    if (error) {
      return { error: error.details[0].message };
    }

    const { schoolName, role, password } = userData;

     if(!schoolName || !role|| !password){
    throw Error('all fields must be filled')
     }
     const salt = await bcrypt.genSalt(10);
     const hash= await bcrypt.hash(password,salt);
     const user= await this.create({schoolName,role,password:hash})
    return user; 
}

export const User = mongoose.model('User',userSchema);














