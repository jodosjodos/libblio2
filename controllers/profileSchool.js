import cloudinary from 'cloudinary';
import { School } from "../models/school.model.js";
import * as dotenv from "dotenv";
import multer from 'multer';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  file: {
    allow: ['image/jpeg', 'image/png'],
  },
  dest: 'uploads/',
});

export const uploadProfilePicture = async (req, res) => {
  const { schoolId } = req.params;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'Please select a file to upload' });
  }

  try {
    const result = await cloudinary.uploader.upload(file.path);
    const updatedUser = await School.findByIdAndUpdate(
      schoolId,
      { profilePicture: result.secure_url },
      { new: true }
    );
    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred while uploading the profile picture', error });
  }
};

