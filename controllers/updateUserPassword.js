import bcrypt from 'bcrypt';
import { User } from '../models/e-users.model.js';

export const updatePassword = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully' });

  } catch (error) {
    console.log('Error updating password:', error);
    return res.status(500).json({ error: 'Failed to update password' });
  }
};
