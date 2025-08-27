import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: String,
  timestamp: Date,
  isOwnMessage: Boolean,
});

const chatThreadSchema = new mongoose.Schema({
  partnerName: String,
  farmerId: String,
  messages: [messageSchema],
});

export default mongoose.model('ChatThread', chatThreadSchema);
