import mongoose from 'mongoose';

const StatusSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.models.Status || mongoose.model('Status', StatusSchema);
