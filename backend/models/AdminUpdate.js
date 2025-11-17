const mongoose = require('mongoose');

const adminUpdateSchema = new mongoose.Schema({
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
    required: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  adminName: {
    type: String,
    required: true
  },
  previousStatus: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved']
  },
  newStatus: {
    type: String,
    required: true,
    enum: ['pending', 'in-progress', 'resolved']
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
adminUpdateSchema.index({ complaintId: 1, createdAt: -1 });
adminUpdateSchema.index({ adminId: 1, createdAt: -1 });

module.exports = mongoose.model('AdminUpdate', adminUpdateSchema);

