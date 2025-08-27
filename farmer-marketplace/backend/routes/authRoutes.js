const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // ← This was missing in your snippet

// 🔐 Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: 'User not found' });

  const token = crypto.randomBytes(32).toString('hex');
  user.resetToken = token;
  user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetLink = `http://localhost:3000/reset-password/${token}`;
  console.log("🔗 Reset Link:", resetLink);

  res.json({ message: 'Password reset link sent to your email' });
});

// 🔐 Reset Password
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

  const hashed = await bcrypt.hash(password, 10);
  user.password = hashed;
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;
  await user.save();

  res.json({ message: 'Password updated successfully' });
});

// 🧾 Register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
      },
    });
  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// 🔓 Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log("🔐 Login request:", { email, password });  // Log incoming request body

  if (!email || !password) return res.status(400).json({ message: 'Please provide all fields' });

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log("✅ User found:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔍 Password match result:", isMatch);

    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    console.log("🔑 JWT Token generated:", token);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("❌ Login error:", err);  // Log the actual error
    res.status(500).json({ message: 'Server error during login' });
  }
});


// 👥 All users (optional)
router.get('/all-users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// ✅ Export once at the end
module.exports = router;
