const express = require('express');
const router = express.Router();
const { createLayout, getLayouts, getLayoutById, updateLayout, deleteLayout } = require('../controllers/layoutController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createLayout);
router.get('/', protect, getLayouts);
router.get('/:id', protect, getLayoutById);
router.put('/:id', protect, updateLayout);
router.delete('/:id', protect, deleteLayout);

module.exports = router;