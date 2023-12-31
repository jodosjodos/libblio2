/**
 * @swagger
 * /history:
 *   post:
 *     summary: Create a history entry
 *     description: Create a new entry in the history
 *     tags:
 *       - History
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               actionName:
 *                 type: string
 *             example:
 *               actionName: Example Action
 *     responses:
 *       200:
 *         description: History entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       401:
 *         description: Failure in creating history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */import { School } from "../models/school.model.js";
import { History } from "../models/history.model.js";

export const createHistoryEntry = async (req, res) => {
  try {
    const today = new Date();
    const date = today.toDateString();
    const time = today.toLocaleTimeString();
    const { actionName, schoolId } = req.body;

    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    const history = new History({
      actionName,
      date,
      time,
      school: schoolId,
    });
    console.log(history.school);
    
    await history.save();
    return res.status(200).json({ message: 'History was saved successfully' });
  } catch (error) {
    return res.status(401).json({ error: 'Failure in creating history' });
  }
};
