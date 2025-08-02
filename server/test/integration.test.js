const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Car } = require('../models/event');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/cars', async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/cars', async (req, res) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json(car);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

describe('Car API Integration Test', () => {
  const testCar = {
    name: 'Test Car',
    year: 2020,
    chassisNumber: '1234567890',
  };

  beforeEach(async () => {
    await Car.deleteMany({});
  });

  describe('GET /cars', () => {
    it('should return all cars', async () => {
      await Car.create(testCar);

      const res = await request(app)
        .get('/cars')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe(testCar.name);
    });
  });

  describe('POST /cars', () => {
    it('should create a new car', async () => {
      const res = await request(app)
        .post('/cars')
        .send(testCar)
        .expect(201);

      expect(res.body.name).toBe(testCar.name);
      expect(res.body.year).toBe(testCar.year);
      expect(res.body.chassisNumber).toBe(testCar.chassisNumber);
    });

    it('should fail to create car without required fields', async () => {
      const res = await request(app)
        .post('/cars')
        .send({ name: 'Incomplete Car' })
        .expect(400);

      expect(res.body.message).toBeDefined();
    });
  });
});
