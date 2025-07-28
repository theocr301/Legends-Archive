const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { Car } = require('./models/event');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/cars', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/cars/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findById(id).populate('history');
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/cars', async (req, res) => {
  try {
    const { name, year, chassisNumber } = req.body;
    const car = await Car.create({ name, year, chassisNumber });
    res.status(201).json(car);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/cars/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, description } = req.body;

    if (!title || !date || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    car.history.push({ title, date, description });
    await car.save();

    res.status(201).json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
