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
    const newLevel = await Level.create({
      levelName,
      school: schoolId,
    });

    res.status(201).json({ message: 'Level created successfully' });
  } catch (error) {
    console.error('Error creating class', error);
    res.status(500).json({ error: 'Failed to create class' });
  }
};
