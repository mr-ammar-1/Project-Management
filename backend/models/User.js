const mongoose = require('mongoose');
const { Schema } = mongoose;

const badgeSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  earned_at: { type: Date, default: Date.now }
}, { _id: false });

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'user'], 
    default: 'user' 
  },
  completed_tasks: { type: Number, default: 0 }, // for ranking
  rank: { type: String, default: 'Beginner' },   // Beginner, Intermediate, Pro
  badges: [badgeSchema],                         // List of earned badges
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
