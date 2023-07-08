/**
 * @swagger
 * /update-school-name:
 *   patch:
 *     summary: Update school name
 *     description: Update the name of a school
 *     tags:
 *       - School
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               newName:
 *                 type: string
 *             example:
 *               userId: abc123
 *               newName: New School Name
 *     responses:
 *       200:
 *         description: School name updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Failed to update school name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
import { School } from '../models/school.model.js';
export const updateSchoolName = async (req, res) => {
  try {
    const { userId, newName } = req.body;
    const user = await School.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.schoolName = newName;
    
    await user.save();

    return res.status(200).json({ message: 'School name updated successfully' });

  } catch (error) {
    console.log('Error updating school name:', error);
    return res.status(500).json({ error: 'Failed to update school name' });
  }
};
