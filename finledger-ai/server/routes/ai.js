const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getInsight,
  getStatus
} = require('../controllers/aiController');

router.post('/insight', protect, getInsight);
router.get('/key-status', getStatus); // Should only work in dev

module.exports = router;
