const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const { authenticateUser } = require('../middleware/authMiddleware');

// Send a message
router.post('/send', authenticateUser, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const sender = req.user.id; // From JWT token
    const senderUser = await User.findById(sender);

    // Check if the sender is a buyer or farmer
    if (!senderUser) {
      return res.status(404).json({ message: 'Sender not found' });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    const newMessage = new Message({
      sender,
      receiver: receiverId,
      content,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// Get all messages between buyer and farmer (buyer perspective)
router.get('/:receiverId', authenticateUser, async (req, res) => {
  try {
    const sender = req.user.id; // The logged-in buyer or farmer
    const receiverId = req.params.receiverId;

    const messages = await Message.find({
      $or: [
        { sender, receiver: receiverId },
        { sender: receiverId, receiver: sender },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get messages' });
  }
});

module.exports = router;
