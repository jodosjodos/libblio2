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
