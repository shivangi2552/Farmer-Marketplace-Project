// insertDummyChats.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ChatThread from './models/ChatThread.js'; // Adjust path as needed

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

await ChatThread.deleteMany(); // Optional: Clear previous

await ChatThread.insertMany([
  {
    partnerName: 'Buyer A',
    farmerId: 'farmer123',
    messages: [
      {
        content: 'Is your spinach fresh today?',
        isOwnMessage: false,
        timestamp: new Date(),
      },
      {
        content: 'Yes! Just picked an hour ago.',
        isOwnMessage: true,
        timestamp: new Date(),
      },
    ],
  },
  {
    partnerName: 'Buyer B',
    farmerId: 'farmer123',
    messages: [
      {
        content: 'I need 10kg of potatoes.',
        isOwnMessage: false,
        timestamp: new Date(),
      },
      {
        content: 'Okay, will pack them for pickup.',
        isOwnMessage: true,
        timestamp: new Date(),
      },
    ],
  },
]);

console.log('Dummy chats inserted!');
await mongoose.disconnect();
