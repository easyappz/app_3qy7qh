const Photo = require('../../models/Photo');
const Rating = require('../../models/Rating');
const User = require('../../models/User');

exports.uploadPhoto = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }
    const photo = new Photo({
      owner: req.user.id,
      imageUrl
    });
    await photo.save();
    res.status(201).json({ photo });
  } catch (error) {
    res.status(500).json({ error: 'Photo upload failed: ' + error.message });
  }
};

exports.getPhotos = async (req, res) => {
  try {
    const { gender, minAge, maxAge } = req.query;
    let query = { status: 'pending', owner: { $ne: req.user.id } };
    if (gender || minAge || maxAge) {
      const userQuery = {};
      if (gender) userQuery.gender = gender;
      if (minAge) userQuery.age = { $gte: Number(minAge) };
      if (maxAge) userQuery.age = { ...userQuery.age, $lte: Number(maxAge) };
      const users = await User.find(userQuery).select('_id');
      const userIds = users.map(u => u._id);
      query.owner = { $in: userIds, $ne: req.user.id };
    }
    const photos = await Photo.find(query).populate('owner', 'name gender age');
    res.json({ photos });
  } catch (error) {
    res.status(500).json({ error: 'Fetching photos failed: ' + error.message });
  }
};

exports.ratePhoto = async (req, res) => {
  try {
    const { photoId, score } = req.body;
    if (!photoId || !score) {
      return res.status(400).json({ error: 'Photo ID and score are required' });
    }
    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    if (photo.owner.toString() === req.user.id) {
      return res.status(400).json({ error: 'Cannot rate your own photo' });
    }
    const rating = new Rating({
      rater: req.user.id,
      photo: photoId,
      score
    });
    await rating.save();
    // Update user points: +1 for rater, -1 for owner if it's a new rating
    await User.findByIdAndUpdate(req.user.id, { $inc: { points: 1 } });
    await User.findByIdAndUpdate(photo.owner, { $inc: { points: -1 } });
    // Update photo stats
    const rater = await User.findById(req.user.id);
    const genderKey = rater.gender;
    const ageGroup = getAgeGroup(rater.age);
    await updatePhotoStats(photoId, genderKey, ageGroup, score);
    res.json({ message: 'Photo rated successfully', rating });
  } catch (error) {
    res.status(500).json({ error: 'Rating failed: ' + error.message });
  }
};

exports.getPhotoStats = async (req, res) => {
  try {
    const { photoId } = req.params;
    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    if (photo.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized access to photo stats' });
    }
    res.json({ stats: photo.ratingStats });
  } catch (error) {
    res.status(500).json({ error: 'Fetching photo stats failed: ' + error.message });
  }
};

const getAgeGroup = (age) => {
  if (age < 25) return '18-24';
  if (age < 35) return '25-34';
  if (age < 45) return '35-44';
  return '45+';
};

const updatePhotoStats = async (photoId, gender, ageGroup, score) => {
  const photo = await Photo.findById(photoId);
  photo.ratingStats[gender].count += 1;
  const oldAvgGender = photo.ratingStats[gender].average;
  photo.ratingStats[gender].average = (oldAvgGender * (photo.ratingStats[gender].count - 1) + score) / photo.ratingStats[gender].count;
  photo.ratingStats.ageGroups[ageGroup].count += 1;
  const oldAvgAge = photo.ratingStats.ageGroups[ageGroup].average;
  photo.ratingStats.ageGroups[ageGroup].average = (oldAvgAge * (photo.ratingStats.ageGroups[ageGroup].count - 1) + score) / photo.ratingStats.ageGroups[ageGroup].count;
  photo.status = 'rated';
  await photo.save();
};
