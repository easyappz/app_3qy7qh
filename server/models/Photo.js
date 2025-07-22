const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  url: { type: String, required: true },
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      score: { type: Number, required: true },
      raterGender: { type: String, enum: ['male', 'female', 'other'] },
      raterAge: { type: Number }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Photo', photoSchema);
