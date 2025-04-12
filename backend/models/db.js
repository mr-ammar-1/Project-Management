// models/db.js
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://techtitans121526:Pakistan786@fyp.t7575.mongodb.net/taskManager?retryWrites=true&w=majority&appName=FYP', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = mongoose;
