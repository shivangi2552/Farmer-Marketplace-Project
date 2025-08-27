const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔍 Decoded token:', decoded); // Add this
    
    // 👇 This must match what you encode in the token at login
    req.user = {
      userId: decoded.id,  // Access 'id' instead of 'userId'
      role: decoded.role,
    };

    console.log('👤 Authenticated user:', req.user);
    next();
  } catch (err) {
    console.error('❌ Invalid token:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};


module.exports = { authenticateUser };
