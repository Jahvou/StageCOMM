const express = require('express');
const router = express.Router();
const { createOrg, generateInvite, joinOrg, getMyOrg, removeMember } = require('../controllers/orgController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createOrg);
router.post('/invite', protect, generateInvite);
router.post('/join', protect, joinOrg);
router.delete('/members/:memberId', protect, removeMember);
router.get('/me', protect, getMyOrg);

module.exports = router;