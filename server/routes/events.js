const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/', async (req, res) => {
  const { title, date, venue } = req.body;

  if (!title || !date || !venue) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newEvent = new Event({ title, date, venue });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create event' });
  }
});

module.exports = router;