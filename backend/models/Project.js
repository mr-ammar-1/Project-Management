// models/Project.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Better to use ObjectId not String
  collaborators: [{ type: Schema.Types.ObjectId, ref: 'User' }], // <-- NEW FIELD
  created_at: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'archived'], required: true }
});

module.exports = mongoose.model('Project', projectSchema);
