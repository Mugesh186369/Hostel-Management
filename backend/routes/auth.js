const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Register new user
router.post('/register', [
  body('userId').trim().notEmpty().withMessage('User ID is required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('roomNumber').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, name, email, password, roomNumber } = req.body;

    // Determine role based on room number
    const role = roomNumber && roomNumber.trim() !== '' ? 'student' : 'admin';

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { userId }]
    });

    if (existingUser) {
      return res.status(400).json({
        error: { message: 'User with this email or User ID already exists' }
      });
    }

    // Create new user
    const user = new User({
      userId,
      name,
      email,
      password,
      role,
      roomNumber: role === 'student' ? roomNumber : null
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        roomNumber: user.roomNumber
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: { message: 'Registration failed', details: error.message } });
  }
});

// Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('userId').trim().notEmpty().withMessage('User ID is required'),
  body('role').isIn(['student', 'admin']).withMessage('Valid role is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, userId, role } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: { message: 'Invalid credentials' } });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: { message: 'Invalid credentials' } });
    }

    // Verify role
    if (user.role !== role) {
      return res.status(401).json({ error: { message: `Invalid credentials for ${role} role` } });
    }

    // Verify user ID
    if (user.userId !== userId) {
      return res.status(401).json({ error: { message: 'User ID does not match' } });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        roomNumber: user.roomNumber
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: { message: 'Login failed', details: error.message } });
  }
});

// Verify token
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: { message: 'Token required' } });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ error: { message: 'User not found' } });
    }

    res.json({
      valid: true,
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        roomNumber: user.roomNumber
      }
    });
  } catch (error) {
    res.status(401).json({ error: { message: 'Invalid token' } });
  }
});

module.exports = router;

