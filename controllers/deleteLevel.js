import { Level } from "../models/systemLevels.js";

export const deleteLevel = async (req, res) => {
    try {
      const { levelId } = req.params;
      const deletedLevel = await Level.findByIdAndDelete(levelId);
  
      if (!deletedLevel) {
        return res.status(404).json({ error: 'Level not found' });
      }
      res.status(200).json({ message: 'Level deleted successfully' });
    } catch (error) {
      console.error('Error deleting class', error);
      res.status(500).json({ error: 'Failed to delete class' });
    }
  };