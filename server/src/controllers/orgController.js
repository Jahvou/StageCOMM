const crypto = require('crypto');
const Org = require('../models/Org');
const User = require('../models/User');

// @route  POST /api/orgs
// @access Private
const createOrg = async (req, res) => {
    try {
        const { name } = req.body;

        // create org with logged in user as creator and first member
        const org = await Org.create({
            name,
            createdBy: req.user._id,
            members: [{ user: req.user._id, role: req.user.role }],
        });

        // attach org to the user
        await User.findByIdAndUpdate(req.user._id, { org: org._id });

        res.status(201).json(org);
    }catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @route  POST /api/orgs/invite
// @access Private
const generateInvite = async (req, res) => {
    try{
        // find the organisation the user belongs to
        const org = await Org.findById(req.user.org);
        if (!org) {
            return res.status(404).json({ message: 'Organisation not found' });
        }

        // Generate random token and set expiry date to 24hrs from now
        const token = crypto.randomBytes(20).toString('hex');
        const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

        org.inviteToken = token;
        org.inviteTokenExpiry = expiry;
        await org.save();

        res.status(200).json({
            inviteToken: token,
            expiresAt: expiry,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @route  POST /api/orgs/join
// @access Private
const joinOrg = async (req, res) => {
    try{
        const { token, role } = req.body;

        // find org with matching token
        const org = await Org.findOne ({ inviteToken: token });
        if (!org) {
            return res.status (400).json({ message: 'Invalit invite token' })
        }

        // checking if token has expired
        if (org.inviteTokenExpiry < Date.now()) {
            return res.status (400).json({ message: 'Invite token has expired' });
        }

        // checking if the user is already a member
        const alreadyMember = org.members.some(
            (m) => m.user.toString() === req.user._id.toString()
        );
        if (alreadyMember) {
            return res.status(400).json({ message: 'You are already a member of this organisation' });
        }

        // add user to org members
        org.members.push({ user: req.user._id, role: role || 'performer' })
        await org.save();

        //attach org to user
        await User.findByIdAndUpdate(req.user._id, { org: org._id });

        res.status(200).json({ message: 'Successfully joined organisation', org });
    }catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
};

//@route  GET /api/orgs/me
//@access Private
const getMyOrg = async (req, res) => {
  try {
    const org = await Org.findById(req.user.org).populate(
      "members.user",
      "name email role",
    );
    if (!req.user.org) {
      return res.status(200).json({ members: [] });
    }
    const org = await Org.findById(req.user.org).populate(
      "members.user",
      "name email role",
    );
    if (!org) {
      return res.status(200).json({ members: [] });
    }
    res.status(200).json(org);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { createOrg, generateInvite, joinOrg, getMyOrg };