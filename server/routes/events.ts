import { Router, Request, Response } from 'express';
import { Car } from '../models/event'; // Ensure Car is imported correctly

const router = Router();

interface reqBody {
  name: string;
  year: number;
  chassisNumber: string;
}

router.get('/cars', async (req: Request, res: Response) => {
  try {
    const cars = await Car.find().sort({ date: 1 });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/cars', async (req: Request<{}, {}, reqBody>, res: Response) => {
  const { name, year, chassisNumber } = req.body;

  if (!name || !year || !chassisNumber) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newCar = new Car({ name, year, chassisNumber });
    await newCar.save();
    res.status(201).json(newCar);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create car' });
  }
});


module.exports = router;