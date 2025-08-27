const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
const registerUser = async (req, res) => {
  console.log('Request body:', req.body); // ✅ Log input

  const { firstName, lastName, email, password, role, phone } = req.body;

  if (!firstName || !lastName || !email || !password || !role || !phone) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      phone,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },  // Use 'id' instead of 'userId'
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    

    res.json({
      token,
      user: { userId: user._id, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err); // <--- check your console for this log
    res.status(500).json({ error: 'Server error during login' });
  }
};

module.exports = {
  registerUser,
  login,
};
