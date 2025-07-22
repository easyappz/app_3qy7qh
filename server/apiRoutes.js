const express = require('express');
const jwt = require('jsonwebtoken');
const authController = require('./api/controllers/authController');
const photoController = require('./api/controllers/photoController');
const userController = require('./api/controllers/userController');

// Secret key for JWT (hardcoded as per instructions)
const JWT_SECRET = 'mysecretkey123';

const router = express.Router();

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Auth Routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/reset-password-request', authController.resetPasswordRequest);
router.post('/reset-password', authController.resetPassword);

// User Routes
router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, userController.updateProfile);

// Photo Routes
router.post('/photos', authenticateToken, photoController.uploadPhoto);
router.get('/photos', authenticateToken, photoController.getPhotos);
router.post('/photos/rate', authenticateToken, photoController.ratePhoto);
router.get('/photos/:photoId/stats', authenticateToken, photoController.getPhotoStats);

// Test Routes
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from API!' });
});

router.get('/status', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
