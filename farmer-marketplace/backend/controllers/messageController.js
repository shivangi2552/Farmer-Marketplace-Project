const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  try {
    const { receiver, content } = req.body;

    const message = await Message.create({
      sender: req.user._id,
      receiver,
      content
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMessagesBetweenUsers = async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
