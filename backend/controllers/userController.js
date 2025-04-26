const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Notification = require('../models/Notification');



exports.addUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the role field (default to 'user' if not provided)
    const newUser = new User({
      
      username,
      email,
      password: hashedPassword,
      role: role || 'user', // Default to 'user' if no role is provided
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User added successfully', user_id: newUser.user_id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update User
exports.updateUser = async (req, res) => {
  try {
    const { user_id, username, email } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { user_id },
      { username, email },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { user_id } = req.body;

    const deletedUser = await User.findOneAndDelete({ user_id });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'user_id username email created_at'); // Only fetch relevant fields
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const { password: _, ...userInfo } = user.toObject(); // Remove password from response
    res.status(200).json({ message: 'Login successful', user: userInfo });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Get Notifications by User ID
exports.getNotificationsByUserId = async (req, res) => {
  const { user_id } = req.params;

  try {
    const notifications = await Notification.find({ user_id }).sort({ created_at: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

// Mark Notifications as Read
exports.markNotificationsAsRead = async (req, res) => {
  const { user_id, notification_id } = req.body;

  try {
    const updatedNotification = await Notification.findOneAndUpdate(
      { user_id, notification_id },
      { is_read: true },
      { new: true } // Return the updated document
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification marked as read', updatedNotification });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification', error: error.message });
  }
};

// Get Notifications by Email
exports.getNotificationsByEmail = async (req, res) => {
  const { email } = req.params;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const notifications = await Notification.find({ user_id: user._id }).sort({ created_at: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

exports.getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // console.log("The required user is: ", user);

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching the user by email",
        error: error.message,
      });
  }
};


exports.getUserRankById = async (req, res) => {
  try {
    const userId = req.params.id; // assuming you're passing user id as a route param

    const users = await User.find().sort({ completed_tasks: -1 }).lean();

    let rank = 1;
    let prevCompletedTasks = null;
    let actualRank = 1;

    for (const user of users) {
      if (prevCompletedTasks !== null && user.completed_tasks < prevCompletedTasks) {
        rank = actualRank;
      }

      if (user._id.toString() === userId.toString()) {
        return res.status(200).json({ rank });
      }

      prevCompletedTasks = user.completed_tasks;
      actualRank++;
    }

    res.status(404).json({ error: "User not found" });
    
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user rank",
      error: error.message,
    });
  }
};


