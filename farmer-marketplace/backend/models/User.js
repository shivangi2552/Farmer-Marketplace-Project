const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['buyer', 'farmer'], // lowercase exactly like this
    required: true,
  }
});

// Prevent "Cannot overwrite model" error in dev
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
