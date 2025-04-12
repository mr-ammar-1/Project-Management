const User = require('../models/User');  // Assuming User model is set up with Mongoose
const bcrypt = require('bcrypt');

exports.authenticateUser = async (req, res, next) => {
  const { email, password } = req.headers; // Get email and password from headers

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Query to get the user from the database by email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    req.user = user; // Attach user info to the request object
    next(); // Proceed to the next middleware/route

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Database error' });
  }
};
