import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  media: { type: String, default: '' },
  status: { type: String, default: 'sent' }, // sent, delivered, read
}, { timestamps: true });

export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);
