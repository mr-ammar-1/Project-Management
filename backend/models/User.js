const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'user'], // You can customize this list as needed
    default: 'user'  // Default role is 'user'
  },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
