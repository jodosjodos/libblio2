import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import joi from 'joi';

const schoolValidationSchema = joi.object({
  schoolName: joi.string().max(50).required(),
  role: joi.string().valid('ADMIN', 'STAFF', 'STUDENT', 'OTHER').required(),
  schoolEmail: joi.string().email().required(),
  librarianEmail: joi.string().email().required(),
  type: joi.string().min(5).max(20).required(),
  location: joi.string().min(5).max(80).required(),
  password: joi.string().min(5).max(20).required(),
  confirmPassword: joi.string().valid(joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
  }),
});

const schoolSchema = new mongoose.Schema({
  schoolName: {
    type: String,
    required: true,
    
  },
  location: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: 'ADMIN'
  },
  schoolEmail: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: false,
  },
  librarianEmail: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date().toLocaleDateString(),

  },
  isBlocked: 
  {
    type: Boolean,
    default: false
  }
});

schoolSchema.statics.signup = async function (schoolData) {
  const { error } = schoolValidationSchema.validate(schoolData);
  if (error) {
    return { error: error.details[0].message };
  }

  const { schoolName, role, password, schoolEmail, librarianEmail, type, location} = schoolData;

  if (!schoolName || !role || !password || !schoolEmail || !librarianEmail || !location|| !type) {
    throw Error('All fields must be filled');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const school = await this.create({
    schoolName,
    role:'ADMIN',
    schoolEmail,
    librarianEmail,
    location,
    type,
    createdAt,
    password: hash,
    isBlocked
  });

  return school;
};

export const School = mongoose.model('school', schoolSchema);
