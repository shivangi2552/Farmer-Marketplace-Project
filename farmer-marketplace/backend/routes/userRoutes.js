const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const { authenticateUser } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/upload');
const User = require('../models/User');

// Get current user's profile
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile (with avatar and more fields)
router.put('/profile', authenticateUser, upload.single('profileImage'), async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      country,
      gender,
      dob,
      preferred, // expecting a JSON string or array
    } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update text fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.city = city || user.city;
    user.state = state || user.state;
    user.country = country || user.country;
    user.gender = gender || user.gender;
    user.dob = dob || user.dob;

    // Preferred categories
    if (preferred) {
      try {
        user.preferred = typeof preferred === 'string' ? JSON.parse(preferred) : preferred;
      } catch (err) {
        console.warn('Invalid preferred format, skipping update');
      }
    }

    // Handle avatar upload
    if (req.file) {
      // Optionally delete old image
      if (user.avatar && fs.existsSync(path.join(__dirname, '..', user.avatar))) {
        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
      }
      user.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    await user.save();
    const updatedUser = await User.findById(user._id).select('-password');
    res.json({ message: 'Profile updated', user: updatedUser });

  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change user password
router.put('/change-password', authenticateUser, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
