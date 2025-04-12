// models/Project.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new Schema({
  
  name: { type: String, required: true },
  description: String,
  created_by: { type: String, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'archived'], required: true }
});

module.exports = mongoose.model('Project', projectSchema);
