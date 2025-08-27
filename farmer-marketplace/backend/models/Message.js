const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  mediaUrl: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Message', messageSchema);
