// controllers/userController.js

import User from '../models/User.js';

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // If a new profile image is uploaded, store its path
    if (req.file) {
      user.profileImage = `${req.protocol}://${req.get('host')}/${req.file.path}`;
    }

    const updatedUser = await user.save();
    res.json({
      name: updatedUser.name,
      email: updatedUser.email,
      profileImage: updatedUser.profileImage,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};
