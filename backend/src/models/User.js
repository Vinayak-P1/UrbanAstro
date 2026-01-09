import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'User' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  profilePic: { type: String, default: '' },
  isAdmin: { type: Boolean, default: false },
  // Simple security question answer (store hashed) - last 4 digits of mobile
  securityAnswer: { type: String, default: '' },
}, { timestamps: true });

// hash password before save
userSchema.pre('save', async function(next) {
  // Hash password if modified
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  // Hash securityAnswer if modified
  if (this.isModified('securityAnswer') && this.securityAnswer) {
    const salt2 = await bcrypt.genSalt(10);
    this.securityAnswer = await bcrypt.hash(this.securityAnswer, salt2);
  }
  next();
});

userSchema.methods.matchPassword = async function(entered) {
  return bcrypt.compare(entered, this.password);
};

userSchema.methods.matchSecurityAnswer = async function(entered) {
  if (!this.securityAnswer) return false;
  return bcrypt.compare(entered, this.securityAnswer);
};

export default mongoose.model('User', userSchema);
