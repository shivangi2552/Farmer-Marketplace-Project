const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const orderRoutes = require('./routes/orderRoutes'); // Adjust path if necessary
const messageRoutes = require('./routes/messageRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
// ✅ Routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
// ✅ Use middleware properly
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Express JSON parser
app.use(express.json());

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/pictures', express.static(path.join(__dirname, 'public', 'pictures')));

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`Requested: ${req.originalUrl}`);
  next();
});
app.use('/api/orders', orderRoutes); // Order routes with /api prefix
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes); // Add this line to use message routes
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the app');
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ message: 'An unexpected error occurred' });
});

// ✅ Connect to DB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
