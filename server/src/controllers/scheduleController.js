const Schedule = require('../models/Schedule');

const createSchedule = async (req, res) => {
  try {
    const { name, items } = req.body;
    const schedule = await Schedule.create({
      name,
      org: req.user.org || req.user._id,
      createdBy: req.user._id,
      items: items || [],
    });
    res.status(201).json(schedule);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({ org: req.user.org || req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(schedules);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
    const scheduleOrg = schedule.org?.toString();
    const userOrg = (req.user.org || req.user._id).toString();
    if (scheduleOrg && scheduleOrg !== userOrg) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.status(200).json(schedule);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
    const scheduleOrg = schedule.org?.toString();
    const userOrg = (req.user.org || req.user._id).toString();
    if (scheduleOrg && scheduleOrg !== userOrg) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const { name, items } = req.body;
    if (name) schedule.name = name;
    if (items) schedule.items = items;
    const updated = await schedule.save();
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
    const scheduleOrg = schedule.org?.toString();
    const userOrg = (req.user.org || req.user._id).toString();
    if (scheduleOrg && scheduleOrg !== userOrg) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await schedule.deleteOne();
    res.status(200).json({ message: 'Schedule deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createSchedule, getSchedules, getScheduleById, updateSchedule, deleteSchedule };