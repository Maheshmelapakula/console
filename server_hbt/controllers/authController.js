const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User.model');
const nodemailer = require('nodemailer');

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password',
  },
});

exports.register = async (req, res) => {
  const { userName, email, password, role } = req.body;
  console.log('Request body:', req.body);
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    
    const salt = await bcrypt.genSalt(10);  // Use 10 rounds for salt
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      userName,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).json({ msg: 'User registered' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes

    // Save OTP and expiration to the user document
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP via email
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It expires in 15 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ msg: 'Error sending OTP' });
      }

      // Generate a token with a short expiration for OTP verification
      const payload = { userId: user._id, role: user.role };
      const token = jwt.sign(payload, "jwtToken", { expiresIn: '15m' });

      res.json({
        message: 'OTP sent to your email. Please verify.',
        token,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.verifyOtp = async (req, res) => {
  const { otp } = req.body;
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'jwtToken');
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    // Clear OTP fields
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // Generate a new token for authenticated session
    const newPayload = { userId: user._id, role: user.role };
    const newToken = jwt.sign(newPayload, 'jwtToken', { expiresIn: '1h' });

    res.json({ msg: 'OTP verified successfully.', token: newToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
