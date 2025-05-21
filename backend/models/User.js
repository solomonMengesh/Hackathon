import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['preparedBy', 'approvedBy'], required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
