const express = require('express');
const { body, validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');
const AdminUpdate = require('../models/AdminUpdate');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

// All admin routes require admin role
router.use(requireRole('admin'));

// Get all complaints (sorted by submission time - newest first)
router.get('/complaints', async (req, res) => {
  try {
    const { status } = req.query;
    
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const complaints = await Complaint.find(query)
      .sort({ createdAt: -1 })
      .populate('studentId', 'name userId email roomNumber')
      .populate('resolvedBy', 'name userId');

    res.json({ complaints });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ error: { message: 'Failed to fetch complaints' } });
  }
});

// Get complaint statistics
router.get('/stats', async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'pending' });
    const inProgress = await Complaint.countDocuments({ status: 'in-progress' });
    const resolved = await Complaint.countDocuments({ status: 'resolved' });

    res.json({
      stats: {
        total,
        pending,
        'in-progress': inProgress,
        resolved
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: { message: 'Failed to fetch statistics' } });
  }
});

// Get a specific complaint by ID
router.get('/complaints/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('studentId', 'name userId email roomNumber')
      .populate('resolvedBy', 'name userId');

    if (!complaint) {
      return res.status(404).json({ error: { message: 'Complaint not found' } });
    }

    // Get admin updates for this complaint
    const updates = await AdminUpdate.find({ complaintId: complaint._id })
      .sort({ createdAt: -1 })
      .populate('adminId', 'name userId');

    res.json({ complaint, updates });
  } catch (error) {
    console.error('Error fetching complaint:', error);
    res.status(500).json({ error: { message: 'Failed to fetch complaint' } });
  }
});

// Update complaint status
router.put('/complaints/:id/status', [
  body('status').isIn(['pending', 'in-progress', 'resolved'])
    .withMessage('Valid status is required'),
  body('adminNotes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, adminNotes } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ error: { message: 'Complaint not found' } });
    }

    const previousStatus = complaint.status;
    complaint.status = status;
    if (adminNotes) {
      complaint.adminNotes = adminNotes;
    }

    if (status === 'resolved') {
      complaint.resolvedBy = req.user._id;
      complaint.resolvedAt = new Date();
    }

    await complaint.save();

    // Create admin update record
    const adminUpdate = new AdminUpdate({
      complaintId: complaint._id,
      adminId: req.user._id,
      adminName: req.user.name,
      previousStatus,
      newStatus: status,
      notes: adminNotes || null
    });

    await adminUpdate.save();

    // Emit real-time update via Socket.io
    const io = req.app.get('io');
    if (io) {
      const updatedComplaint = await Complaint.findById(complaint._id)
        .populate('studentId', 'name userId email roomNumber')
        .populate('resolvedBy', 'name userId');
      
      io.to(complaint.studentId.toString()).emit('complaint-updated', updatedComplaint);
      io.to('admin-room').emit('complaint-status-changed', updatedComplaint);
    }

    res.json({
      message: 'Complaint status updated successfully',
      complaint
    });
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({ error: { message: 'Failed to update complaint', details: error.message } });
  }
});

// Mark complaint as resolved
router.put('/complaints/:id/resolve', [
  body('adminNotes').optional().trim()
], async (req, res) => {
  try {
    const { adminNotes } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ error: { message: 'Complaint not found' } });
    }

    const previousStatus = complaint.status;
    complaint.status = 'resolved';
    complaint.resolvedBy = req.user._id;
    complaint.resolvedAt = new Date();
    if (adminNotes) {
      complaint.adminNotes = adminNotes || 'Complaint resolved by administrator.';
    }

    await complaint.save();

    // Create admin update record
    const adminUpdate = new AdminUpdate({
      complaintId: complaint._id,
      adminId: req.user._id,
      adminName: req.user.name,
      previousStatus,
      newStatus: 'resolved',
      notes: adminNotes || 'Complaint resolved by administrator.'
    });

    await adminUpdate.save();

    // Emit real-time update via Socket.io
    const io = req.app.get('io');
    if (io) {
      const updatedComplaint = await Complaint.findById(complaint._id)
        .populate('studentId', 'name userId email roomNumber')
        .populate('resolvedBy', 'name userId');
      
      io.to(complaint.studentId.toString()).emit('complaint-resolved', updatedComplaint);
      io.to('admin-room').emit('complaint-status-changed', updatedComplaint);
    }

    res.json({
      message: 'Complaint marked as resolved',
      complaint
    });
  } catch (error) {
    console.error('Error resolving complaint:', error);
    res.status(500).json({ error: { message: 'Failed to resolve complaint', details: error.message } });
  }
});

module.exports = router;

