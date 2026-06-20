const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered!' });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({ name, email, password: hashed });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'roommateai_secret', { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
} catch (err) {
    console.log('Signup Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found!' });

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Wrong password!' });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'roommateai_secret', { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong!' });
  }
});
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// FORGOT PASSWORD - Send OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'No account with this email!' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOTP = otp;
    user.resetOTPExpiry = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🏠 RoommateAI - Password Reset OTP',
      html: `<div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: #EC4899;">RoommateAI Password Reset</h2>
        <p>Your OTP code is:</p>
        <h1 style="background: #18181b; color: white; padding: 16px; border-radius: 12px; text-align: center; letter-spacing: 8px;">${otp}</h1>
        <p>This code expires in 10 minutes.</p>
      </div>`
    });

    res.json({ message: 'OTP sent to your email!' });
  } catch (err) {
    console.log('Forgot Password Error:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// RESET PASSWORD - Verify OTP & set new password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found!' });
    if (user.resetOTP !== otp) return res.status(400).json({ error: 'Invalid OTP!' });
    if (Date.now() > user.resetOTPExpiry) return res.status(400).json({ error: 'OTP expired!' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetOTP = '';
    await user.save();

    res.json({ message: 'Password reset successful!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset password' });
  }
});
module.exports = router;