const express = require('express');
const router = express.Router();
const Log = require('../models/Logs.model');

// Create a new log entry
router.post('/', async (req, res) => {
  try {
    const log = new Log(req.body);
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all log entries
router.get('/', async (req, res) => {
  try {
    const logs = await Log.find().populate('user');
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific log entry by ID
router.get('/:id', async (req, res) => {
  try {
    const log = await Log.findById(req.params.id).populate('user');
    if (!log) {
      return res.status(404).json({ error: 'Log not found' });
    }
    res.status(200).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a specific log entry by ID
router.put('/:id', async (req, res) => {
  try {
    const log = await Log.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!log) {
      return res.status(404).json({ error: 'Log not found' });
    }
    res.status(200).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a specific log entry by ID
router.delete('/:id', async (req, res) => {
  try {
    const log = await Log.findByIdAndDelete(req.params.id);
    if (!log) {
      return res.status(404).json({ error: 'Log not found' });
    }
    res.status(200).json({ message: 'Log deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
