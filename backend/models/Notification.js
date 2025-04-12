// models/Notification.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
  user_id: { type: String, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['assignment', 'reminder'], required: true },
  is_read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  related_task_id: { type: String, ref: 'Task' }
});

module.exports = mongoose.model('Notification', notificationSchema);
