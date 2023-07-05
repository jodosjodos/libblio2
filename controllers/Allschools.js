import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import.meta.url;
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


import { School } from "../models/school.model.js";

export const getAllSchools = async (req, res) => {
    try {
      const schools = await School.find().select('-password');
  
      res.status(200).json(schools);
    } catch (error) {
      console.error('Error fetching schools:', error);
      res.status(500).json({ error: 'Failed to fetch schools' });
    }
  };
  