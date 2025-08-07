import express, { Request, Response } from 'express';
import mongoose from 'mongoose';

import cors from 'cors';
import dotenv from 'dotenv';
import { Car } from './models/event';

import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

dotenv.config();

export const app = express();
app.use(cors());
app.use(express.json());

app.get('/cars', async (req: Request, res: Response) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 }); // Sort by createdAt descending
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

app.get('/cars/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

app.post('/cars', upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { name, year, chassisNumber } = req.body as { name: string; year: number; chassisNumber: string }; // req.body is populated by multer
    let imageUrl: string | null = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }
    const car = await Car.create({ name, year, chassisNumber, imageUrl });
    res.status(201).json(car);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
});

app.use('/uploads', express.static('uploads'));

app.post('/cars/:id/history', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, date, description } = req.body as { title: string; date: Date; description: string };

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
    res.status(500).json({ message: (err as Error).message });
  }
});

app.delete('/cars/:id/history/:eventId', async (req: Request, res: Response) => {
  try {
    const { id, eventId } = req.params;
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    console.log('eventId:', eventId);
    console.log('car.history:', car.history.map(h => h._id!.toString()));

    const eventIndex = car.history.findIndex(
      (h) => h._id!.toString() === eventId
    );
    if (eventIndex === -1) {
      return res.status(404).json({ message: 'History event not found' });
    }

    car.history.splice(eventIndex, 1);
    await car.save();

    res.status(200).json({ message: 'History event deleted', car });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
