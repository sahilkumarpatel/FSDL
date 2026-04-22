const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Infrastructure', 'Parking', 'Sanitation', 'Electrical', 'Other'],
    required: true 
  },
  photoURL: { type: String, default: null },
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'
  },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  feedback: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Issue', issueSchema);
