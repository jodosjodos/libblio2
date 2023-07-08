import { School } from "../models/school.model.js";
export const deleteSchool = async (req, res) => {
  const { schoolId } = req.params;

  try {
    const deletedSchool = await School.findByIdAndDelete(schoolId);

    if (!deletedSchool) {
      return res.status(404).json({ message: 'Level not found' });
    }
    return res.status(200).json({ message: 'Level deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred while deleting the level', error });
  }
};