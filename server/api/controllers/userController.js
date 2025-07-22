const User = require('../../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -resetPasswordToken -resetPasswordExpires');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Fetching profile failed: ' + error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, gender, age } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, gender, age },
      { new: true, select: '-password -resetPasswordToken -resetPasswordExpires' }
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Updating profile failed: ' + error.message });
  }
};
