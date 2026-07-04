const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register new user
const register = async (req, res) => {
  try {
    const { name, email, password, orgName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Create user with admin role if creating an org
    const user = await User.create({
      name,
      email,
      password,
      role: orgName ? 'admin' : 'performer',
    });

    // If orgName provided, create the org and link it to the user
    if (orgName) {
      const Org = require('../models/Org');
      const org = await Org.create({
        name: orgName,
        createdBy: user._id,
        members: [{ user: user._id, role: 'admin' }],
      });
      user.org = org._id;
      await user.save();
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      org: user.org,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            org: user.org,
            token: generateToken(user._id),
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
 module.exports = { register, login };