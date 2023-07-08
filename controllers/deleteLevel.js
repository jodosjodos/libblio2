/**
 * @swagger
 * /levels/{levelId}:
 *   delete:
 *     summary: Delete a level
 *     description: Delete a level with the provided ID
 *     tags:
 *       - Levels
 *     parameters:
 *       - in: path
 *         name: levelId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the level to be deleted
 *     responses:
 *       200:
 *         description: Level deleted successfully
 *       404:
 *         description: Level not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: An error occurred while deleting the level
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                 error:
 *                   type: object
 *                   description: Error details
 */
import { Level } from "../models/systemLevels.js";
export const deleteLevel = async (req, res) => {
  const { levelId } = req.params;

  try {
    const deletedLevel = await Level.findByIdAndDelete(levelId);

    if (!deletedLevel) {
      return res.status(404).json({ message: 'Level not found' });
    }
    return res.status(200).json({ message: 'Level deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred while deleting the level', error });
  }
};


