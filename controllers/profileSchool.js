import { config, v2 } from "cloudinary";
config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
import { unlink } from "fs";
import { Image } from "../models/images.js";

export const uplaodProfilePicture = async (req, res) => {
  try {
    console.log(req.file);
    const result = await v2.uploader.upload(req.file.path);
    const newImage = new Image({
      imageURL: result.url,
      public_id: result.public_id,
    });

    const savedImage = await newImage.save();
    if(savedImage){
      await unlink(req.file.path);
      res.status(200).json({
        message: "Image uploaded successfully",
        image: savedImage,
    });
    };
    res.status(401).json("Failure to uplaod image")
  } catch (e) {
    res.json(e);
  }
};
