const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, 'secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in' });
  }
};

exports.getProfile = (req, res) => {
  res.json(req.user);
};

exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.registerUser = registerUser;


const forgetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.forgetPassword = forgetPassword;
exports.getUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };
exports.updateUserProfile = async (req, res) => {
    try {
      const { username, email } = req.body;
      const updatedUser = await User.findByIdAndUpdate(req.user.id, { username, email }, { new: true });
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'error fetching users' });
  }
};
exports.getUsers = getUsers;
const getUserProfileById = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: 'user not found' });
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: 'error fetching' });
    }
  };
exports.getUserProfileById = getUserProfileById;
const getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) return res.status(404).json({ message: 'User not found' });

      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching user' });
    }
  };
exports.getUserById = getUserById;
const updateUserRole = async (req, res) => {
    try {
      const { role } = req.body;
      const user = await User.findById(req.params.id);

      if (!user) return res.status(404).json({ message: 'User not found' });

      user.role = role || user.role;
      await user.save();

      res.status(200).json({ message: 'User role updated successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error updating role' });
    }
  };
exports.updateUserRole = updateUserRole;
const deleteUser = async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);

      if (!user) return res.status(404).json({ message: 'User not found' });

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting user' });
    }
  };
exports.deleteUser = deleteUser;