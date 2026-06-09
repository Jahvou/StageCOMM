const express = require('express');
const router = express.Router();
const { createOrg, generateInvite, joinOrg, getMyOrg } = require('../controllers/orgController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createOrg);
router.post('/invite', protect, generateInvite);
router.post('/join', protect, joinOrg);
router.get('/me', protect, getMyOrg);

module.exports = router;