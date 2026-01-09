import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isEmail } from '../utils/validate.js'; // if not exist, simple check below
import cloudinary from '../config/cloudinary.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

export const register = async (req, res) => {
  try {
    console.log('REGISTER Content-Type:', req.headers['content-type']);
    console.log('REGISTER req.file:', !!req.file);
    const { name, email, phone, password, securityAnswer } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
    // basic email check if utils missing:
    const okEmail = typeof isEmail === 'function' ? isEmail(email) : /\S+@\S+\.\S+/.test(email);
    if (!okEmail) return res.status(400).json({ error: 'Invalid email' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already in use' });

    let profilePic = '';
    if (req.file) {
      // multer-storage-cloudinary may already provide the uploaded URL in the file object
      profilePic = req.file.path || req.file.url || req.file.secure_url || '';
      // fallback: if only local path present, upload via cloudinary
      if (!profilePic && req.file.path) {
        try {
          const upload = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: 'profiles',
          });
          profilePic = upload.secure_url;
        } catch (e) {
          console.error('PROFILE UPLOAD ERROR:', e);
        }
      }
    }

    const user = await User.create({ name, email, phone, password, profilePic, securityAnswer: securityAnswer || '' });
    const token = signToken(user._id);
    res.json({ user: { id: user._id, name: user.name, email: user.email, phone: user.phone, profilePic: user.profilePic, isAdmin: user.isAdmin }, token });
  } catch (e) {
    console.error('REGISTER ERROR:', e);
    res.status(500).json({ error: e.message });
  }
};

export const forgotVerify = async (req, res) => {
  try {
    const { email, securityAnswer } = req.body || {};
    if (!email || !securityAnswer) return res.status(400).json({ error: 'Missing fields' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const ok = await user.matchSecurityAnswer(securityAnswer);
    if (!ok) return res.status(400).json({ error: 'Incorrect security answer' });
    res.json({ success: true });
  } catch (e) {
    console.error('FORGOT VERIFY ERROR:', e);
    res.status(500).json({ error: e.message });
  }
};

export const forgotReset = async (req, res) => {
  try {
    const { email, securityAnswer, newPassword } = req.body || {};
    if (!email || !securityAnswer || !newPassword) return res.status(400).json({ error: 'Missing fields' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const ok = await user.matchSecurityAnswer(securityAnswer);
    if (!ok) return res.status(400).json({ error: 'Incorrect security answer' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true });
  } catch (e) {
    console.error('FORGOT RESET ERROR:', e);
    res.status(500).json({ error: e.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const ok = await user.matchPassword(password);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

    const token = signToken(user._id);
    res.json({ user: { id: user._id, name: user.name, email: user.email, phone: user.phone, profilePic: user.profilePic, isAdmin: user.isAdmin }, token });
  } catch (e) {
    console.error('LOGIN ERROR:', e);
    res.status(500).json({ error: e.message });
  }
};

export const me = async (req, res) => {
  res.json({ user: req.user });
};
