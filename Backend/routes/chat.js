const express = require("express");
const Message = require('../models/Message');
const User = require('../models/User');
const socketIo = require('socket.io');
const router = express.Router();

// Send message
router.post('/messages', async (req, res) => {
  const { receiverId, content } = req.body;
  const senderId = req.userId;
  
  try {
    const newMessage = new Message({ sender: senderId, receiver: receiverId, content });
    await newMessage.save();

    // Emit message to receiver through WebSocket
    const io = req.app.get('io');
    io.to(receiverId).emit('receiveMessage', {
      senderId,
      content,
      timestamp: new Date(),
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' });
  }
});

// Get all messages
router.get('/messages/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: req.userId, receiver: userId },
        { sender: userId, receiver: req.userId },
      ],
    }).populate('sender receiver', 'username email');
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

module.exports = router;
