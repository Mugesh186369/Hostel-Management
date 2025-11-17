const express = require('express');
const { body, validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all complaints for a student (their own complaints)
router.get('/my-complaints', requireRole('student'), async (req, res) => {
  try {
    const complaints = await Complaint.find({ studentId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('resolvedBy', 'name userId');

    res.json({ complaints });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ error: { message: 'Failed to fetch complaints' } });
  }
});

// Create a new complaint
router.post('/create', requireRole('student'), [
  body('roomNumber').trim().notEmpty().withMessage('Room number is required'),
  body('category').isIn(['plumbing', 'electrical', 'furniture', 'cleaning', 'internet', 'security', 'other'])
    .withMessage('Valid category is required'),
  body('description').trim().notEmpty().withMessage('Description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { roomNumber, category, description } = req.body;

    const complaint = new Complaint({
      studentId: req.user._id,
      studentName: req.user.name,
      userId: req.user.userId,
      roomNumber,
      category,
      description,
      status: 'pending'
    });

    await complaint.save();

    // Emit real-time update via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('new-complaint', complaint);
      io.to('admin-room').emit('complaint-created', complaint);
    }

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint
    });
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ error: { message: 'Failed to create complaint', details: error.message } });
  }
});

// Get a specific complaint by ID (student can only see their own)
router.get('/:id', requireRole('student'), async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('resolvedBy', 'name userId');

    if (!complaint) {
      return res.status(404).json({ error: { message: 'Complaint not found' } });
    }

    // Check if complaint belongs to the student
    if (complaint.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    res.json({ complaint });
  } catch (error) {
    console.error('Error fetching complaint:', error);
    res.status(500).json({ error: { message: 'Failed to fetch complaint' } });
  }
});

module.exports = router;

