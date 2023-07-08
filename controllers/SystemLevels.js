/**
 * @swagger
 * /levels:
 *   post:
 *     summary: Create a new level
 *     description: Create a new level for a school
 *     tags:
 *       - Levels
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               levelName:
 *                 type: string
 *               schoolId:
 *                 type: string
 *             example:
 *               levelName: Level 1
 *               schoolId: abc123
 *     responses:
 *       201:
 *         description: Level created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       404:
 *         description: School not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Failed to create level
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
import { School } from "../models/school.model.js";
import { Level } from "../models/systemLevels.js";

export const createLevel = async (req, res) => {
  try {
    const { levelName, schoolId } = req.body;


    const school = await School.exists({ _id: schoolId });
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    // Create the new level document and associate it with the schoolId
     await Level.create({
      levelName,
      school: schoolId,
    });

    res.status(201).json({ message: 'Level created successfully' });
  } catch (error) {
    console.error('Error creating class', error);
    res.status(500).json({ error: 'Failed to create class' });
  }
};
