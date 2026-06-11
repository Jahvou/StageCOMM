const express = require('express');
const router = express.Router();
const { createSchedule, getSchedules, getScheduleById, updateSchedule, deleteSchedule } = require('../controllers/scheduleController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createSchedule);
router.get('/', protect, getSchedules);
router.get('/:id', protect, getScheduleById);
router.put('/:id', protect, updateSchedule);
router.delete('/:id', protect, deleteSchedule);

module.exports = router;