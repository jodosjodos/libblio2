/**
 * @swagger
 * /history:
 *   get:
 *     summary: Get all history entries
 *     description: Retrieve all history entries
 *     tags:
 *       - History
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   actionName:
 *                     type: string
 *                     description: Name of the action
 *                   date:
 *                     type: string
 *                     description: Formatted date of the action
 *                   time:
 *                     type: string
 *                     description: Time of the action
 *       500:
 *         description: Failed to fetch history entries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
import { History } from "../models/history.model.js";
export const getAllHistoryEntries = async (req, res) => {
    try {
      const entries = await History.find();
      const formattedEntries = entries.map(entry => {
        const entryDate = new Date(entry.date).getDate();
        const currentDate = new Date().getDate();
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  
        let formattedDate;
        if (entryDate === currentDate) {
          formattedDate = 'Today';
        } else if (entryDate === yesterdayDate.getDate()) {
          formattedDate = 'Yesterday';
        } else {
          formattedDate = new Date(entry.date).toDateString(); // Use your desired date format here
        }
  
        return {
          actionName: entry.actionName,
          date: formattedDate,
          time: entry.time
        };
      });
  
      res.status(200).json(formattedEntries);
    } catch (error) {
      console.error('Error fetching history entries:', error);
      res.status(500).json({ error: 'Failed to fetch history entries' });
    }
  };
  