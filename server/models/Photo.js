const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'rated'],
    default: 'pending'
  },
  ratingStats: {
    male: {
      count: { type: Number, default: 0 },
      average: { type: Number, default: 0 }
    },
    female: {
      count: { type: Number, default: 0 },
      average: { type: Number, default: 0 }
    },
    other: {
      count: { type: Number, default: 0 },
      average: { type: Number, default: 0 }
    },
    ageGroups: {
      '18-24': { count: { type: Number, default: 0 }, average: { type: Number, default: 0 } },
      '25-34': { count: { type: Number, default: 0 }, average: { type: Number, default: 0 } },
      '35-44': { count: { type: Number, default: 0 }, average: { type: Number, default: 0 } },
      '45+': { count: { type: Number, default: 0 }, average: { type: Number, default: 0 } }
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Photo', photoSchema);
