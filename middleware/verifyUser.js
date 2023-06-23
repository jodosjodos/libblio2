import { StatusCodes } from "http-status-codes";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


const decodeToken = (token) => {
  try {
    const decodedToken = jwt.decode(token, process.env.JWT_SECRET);
   
    return decodedToken;
  } catch (error) {
    console.error('Error decoding token:', error);
    throw new Error('Token decoding error');
  }
};

export const verifyUser = async (req, res, next) => {
  const { token } = req.params;
console.log(token);

  try {
    const decodedToken = await decodeToken(token);
    
    const id=decodedToken.id
    const user=await User.findOne({_id:id})
  if(!user){
    return res.status(StatusCodes.UNAUTHORIZED).json({err:"user not found"})
  }

  req.user=user

    next();
  } catch (error) {
    console.error('Error verifying user:', error);
    res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid token' });
  }
};
