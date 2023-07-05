import  mongoose from 'mongoose';
import  bcrypt  from 'bcrypt';
import  joi from 'joi'
import { School } from './school.model.js';

// const userValidationSchema = joi.object({
//     schoolName:joi.string().max(50).required(),
//     role:joi.string().valid('STAFF','STUDENT','OTHER').required(),
//     email:joi.string().email().required(),
//     password:joi.string().min(5).max(20).required(),
//     confirmPassword: joi.string().valid(joi.ref('password')).required().messages({'any.only': 'Passwords do not match'}),
// })
const userSchema = new mongoose.Schema({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
    role: {
      type: String,
      required: true,
      enum: ['STUDENT', 'OTHER','STAFF'],
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
    isBlocked: 
    {
      type: Boolean,
      default: false
    }
  });
  userSchema.statics.signup = async function (userData) {
    const { error } = userValidationSchema.validate(userData);
    if (error) {
      return { error: error.details[0].message };
    }
  
    const { schoolId, schoolName, role, email, password } = userData;
  
    if (!schoolId || !schoolName || !role || !password || !email) {
      throw new Error('All fields must be filled');
    }
  
    const school = await School.findById(schoolId);
    if (!school) {
      throw new Error('Invalid school ID');
    }
  
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await this.create({
      school: School._id,
      role,
      email,
      password: hash,
      isBlocked: false,
    });
  
    return user;
  };
  
export const User = mongoose.model('user',userSchema);














