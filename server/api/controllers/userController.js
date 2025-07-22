const User = require('../../models/User');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // From JWT middleware
    const user = await User.findById(userId).select('-password -resetPasswordToken -resetPasswordExpires');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // From JWT middleware
    const { username, gender, age } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { username, gender, age },
      { new: true, select: '-password -resetPasswordToken -resetPasswordExpires' }
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
