const Photo = require('../../models/Photo');
const User = require('../../models/User');
const multer = require('multer');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage }).single('photo');

// Upload photo
exports.uploadPhoto = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    try {
      const userId = req.user.userId; // From JWT middleware
      const photo = new Photo({
        userId,
        url: req.file.path
      });
      await photo.save();
      res.status(201).json({ photo });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

// Get photos with filters
exports.getPhotos = async (req, res) => {
  try {
    const { gender, minAge, maxAge } = req.query;
    let query = {};

    if (gender || minAge || maxAge) {
      const userQuery = {};
      if (gender) userQuery.gender = gender;
      if (minAge || maxAge) {
        userQuery.age = {};
        if (minAge) userQuery.age.$gte = Number(minAge);
        if (maxAge) userQuery.age.$lte = Number(maxAge);
      }
      const users = await User.find(userQuery).select('_id');
      const userIds = users.map(user => user._id);
      query.userId = { $in: userIds };
    }

    const photos = await Photo.find(query).populate('userId', 'username gender age');
    res.json({ photos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Rate a photo
exports.ratePhoto = async (req, res) => {
  try {
    const { photoId, score } = req.body;
    const raterId = req.user.userId; // From JWT middleware

    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    if (photo.userId.toString() === raterId) {
      return res.status(400).json({ error: 'Cannot rate your own photo' });
    }

    const rater = await User.findById(raterId);
    if (rater.points < 1) {
      return res.status(400).json({ error: 'Not enough points to rate' });
    }

    // Update points
    rater.points += 1;
    const owner = await User.findById(photo.userId);
    owner.points -= 1;

    // Add rating
    photo.ratings.push({
      userId: raterId,
      score,
      raterGender: rater.gender,
      raterAge: rater.age
    });

    await rater.save();
    await owner.save();
    await photo.save();

    res.json({ message: 'Rating added', photo, raterPoints: rater.points });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get rating statistics for a photo
exports.getPhotoStats = async (req, res) => {
  try {
    const { photoId } = req.params;
    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    const ratings = photo.ratings;
    const stats = {
      totalRatings: ratings.length,
      averageScore: ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length : 0,
      byGender: {
        male: { count: 0, avgScore: 0 },
        female: { count: 0, avgScore: 0 },
        other: { count: 0, avgScore: 0 }
      },
      byAge: {
        under20: { count: 0, avgScore: 0 },
        '20-30': { count: 0, avgScore: 0 },
        '30-40': { count: 0, avgScore: 0 },
        over40: { count: 0, avgScore: 0 }
      }
    };

    ratings.forEach(r => {
      // Gender stats
      if (r.raterGender === 'male') {
        stats.byGender.male.count++;
        stats.byGender.male.avgScore += r.score;
      } else if (r.raterGender === 'female') {
        stats.byGender.female.count++;
        stats.byGender.female.avgScore += r.score;
      } else {
        stats.byGender.other.count++;
        stats.byGender.other.avgScore += r.score;
      }

      // Age stats
      if (r.raterAge < 20) {
        stats.byAge.under20.count++;
        stats.byAge.under20.avgScore += r.score;
      } else if (r.raterAge >= 20 && r.raterAge < 30) {
        stats.byAge['20-30'].count++;
        stats.byAge['20-30'].avgScore += r.score;
      } else if (r.raterAge >= 30 && r.raterAge < 40) {
        stats.byAge['30-40'].count++;
        stats.byAge['30-40'].avgScore += r.score;
      } else {
        stats.byAge.over40.count++;
        stats.byAge.over40.avgScore += r.score;
      }
    });

    // Calculate averages
    for (const gender in stats.byGender) {
      if (stats.byGender[gender].count > 0) {
        stats.byGender[gender].avgScore /= stats.byGender[gender].count;
      }
    }
    for (const ageRange in stats.byAge) {
      if (stats.byAge[ageRange].count > 0) {
        stats.byAge[ageRange].avgScore /= stats.byAge[ageRange].count;
      }
    }

    res.json({ stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
