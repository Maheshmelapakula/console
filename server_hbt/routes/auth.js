require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const UserModel = require('../models/User.model');
const router = express.Router();

// Function to generate a unique ID
const generateUniqueId = () => uuidv4();

// Function to save log entry to a file (or could be a database)
const saveLogEntry = (logEntry) => {
  const logFilePath = './logs.json';

  // Read existing logs
  let logs = [];
  if (fs.existsSync(logFilePath)) {
    const logsData = fs.readFileSync(logFilePath);
    logs = JSON.parse(logsData);
  }

  // Add the new log entry
  logs.push(logEntry);

  // Write the updated logs back to the file
  fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));
};

// Middleware to log user activity
const logUserActivity = (type, user, message) => {
  const logEntry = {
    id: generateUniqueId(),
    type,
    user: user.email,
    userType: user.role,
    message,
    timestamp: new Date(),
  };

  saveLogEntry(logEntry);
};




// Register Route
router.post('/register', async (req, res) => {
  const { userName, email, password, role } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      logUserActivity('Registration', existingUser, 'Attempt to register with existing email');
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      userName,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    logUserActivity('Registration', newUser, 'User registered successfully');
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logUserActivity('Login', user, 'Failed login attempt');
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    logUserActivity('Login', user, 'Login successful');
    res.json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// OTP Verification Route
// router.post('/verify-otp', async (req, res) => {
//   const { otp } = req.body;
//   const authHeader = req.header('Authorization');

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'Access denied. No token provided.' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await UserModel.findById(decoded.userId);
//     if (!user) {
//       return res.status(400).json({ message: 'User not found' });
//     }

//     if (user.otp !== otp) {
//       logUserActivity('OTP Verification', user, 'Failed OTP verification');
//       return res.status(400).json({ message: 'Invalid OTP' });
//     }

//     user.otp = null;
//     await user.save();

//     const newPayload = { userId: user._id, is2FACompleted: true };
//     const newToken = jwt.sign(newPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

//     logUserActivity('OTP Verification', user, 'OTP verified successfully');
//     res.json({ message: 'OTP verified successfully.', token: newToken });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

module.exports = router;
