const Layout = require('../models/Layout');

const createLayout = async (req, res) => {
  try {
    const { name, sections } = req.body;
    const layout = await Layout.create({
      name,
      org: req.user.org || req.user._id,
      createdBy: req.user._id,
      sections: sections || [],
    });
    res.status(201).json(layout);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getLayouts = async (req, res) => {
  try {
    const layouts = await Layout.find({ org: req.user.org || req.user._id });
    res.status(200).json(layouts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getLayoutById = async (req, res) => {
  try {
    const layout = await Layout.findById(req.params.id);
    if (!layout) {
      return res.status(404).json({ message: 'Layout not found' });
    }
    const layoutOrg = layout.org?.toString();
    const userOrg = (req.user.org || req.user._id).toString();
    if (layoutOrg && layoutOrg !== userOrg) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.status(200).json(layout);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateLayout = async (req, res) => {
  try {
    const layout = await Layout.findById(req.params.id);
    if (!layout) {
      return res.status(404).json({ message: 'Layout not found' });
    }
    const layoutOrg = layout.org?.toString();
    const userOrg = (req.user.org || req.user._id).toString();
    if (layoutOrg && layoutOrg !== userOrg) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const { name, sections, isActive } = req.body;
    if (name) layout.name = name;
    if (sections) layout.sections = sections;
    if (typeof isActive === 'boolean') layout.isActive = isActive;
    const updated = await layout.save();
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteLayout = async (req, res) => {
  try {
    const layout = await Layout.findById(req.params.id);
    if (!layout) {
      return res.status(404).json({ message: 'Layout not found' });
    }
    const layoutOrg = layout.org?.toString();
    const userOrg = (req.user.org || req.user._id).toString();
    if (layoutOrg && layoutOrg !== userOrg) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await layout.deleteOne();
    res.status(200).json({ message: 'Layout deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createLayout, getLayouts, getLayoutById, updateLayout, deleteLayout };