// models/Task.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  status: { 
    type: String, 
    enum: ['todo', 'in_progress', 'completed', 'archived'], 
    required: true 
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'low',
    required: true
  },
  repeats: {
    type: String,
    enum: ['none', 'daily', 'weekly', 'monthly'],
    default: 'none',
    required: true
  },
  progress: { type: Number, default: 0 }, // Store progress (0-100)
  due_date: { type: Date, required: true },
  comments: [
    {
      text: { type: String, required: true },
      commented_by: { type: String, ref: 'User', required: true },
      commented_at: { type: Date, default: Date.now }
    }
  ],
  created_by: { type: String, ref: 'User', required: true },
  project_id: { type: String, ref: 'Project', required: true },
  created_at: { type: Date, default: Date.now },
  completed_at: Date,
  completed_by: { type: String, ref: 'User' },
  assignee_id: { type: String, ref: 'User' },
  allocated_by: { type: String, ref: 'User' },
  allocated_at: Date
});

module.exports = mongoose.model('Task', taskSchema);
