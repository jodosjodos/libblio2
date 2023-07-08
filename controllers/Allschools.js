/**
 * @swagger
 * /schools:
 *   get:
 *     summary: Get all schools
 *     description: Retrieve all schools
 *     tags:
 *       - Schools
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/School'
 *       500:
 *         description: Failed to fetch schools
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
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
  