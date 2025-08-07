import request from 'supertest';
import express from 'express';
import { Car } from '../models/event';
import { app as server } from '../server';

jest.mock('../models/event');

const mockedFind = Car.find as jest.MockedFunction<typeof Car.find>;
const mockedFindById = Car.findById as jest.MockedFunction<typeof Car.findById>;
const mockedCreate = Car.create as jest.MockedFunction<typeof Car.create>;

const app = express();
app.use(express.json());
app.use('/', server);

describe('Car API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /cars', () => {
    it('should return a list of cars', async () => {
      mockedFind.mockReturnValue({
        sort: jest.fn().mockResolvedValue([{ name: 'Test Car' }]),
      } as any);

      const res = await request(app).get('/cars');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ name: 'Test Car' }]);
    });

    it('should handle errors', async () => {
      mockedFind.mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error('DB error')),
      } as any);

      const res = await request(app).get('/cars');
      expect(res.status).toBe(500);
      expect(res.body.message).toBe('DB error');
    });
  });

  describe('GET /cars/:id', () => {
    it('should return a car by ID', async () => {
      mockedFindById.mockResolvedValue({
        _id: 'someid',
        name: 'Car A',
        year: 2019,
        chassisNumber: 'ABC123',
        __v: 0,
      } as any);

      const res = await request(app).get('/cars/123');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        _id: 'someid',
        name: 'Car A',
        year: 2019,
        chassisNumber: 'ABC123',
        __v: 0,
      });
    });

    it('should return 404 if car not found', async () => {
      mockedFindById.mockResolvedValue(null);

      const res = await request(app).get('/cars/123');
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Car not found');
    });

    it('should handle DB errors', async () => {
      mockedFindById.mockRejectedValue(new Error('DB error'));

      const res = await request(app).get('/cars/123');
      expect(res.status).toBe(500);
      expect(res.body.message).toBe('DB error');
    });
  });

  describe('POST /cars', () => {
    it('should create a car without image', async () => {
      mockedCreate.mockResolvedValue({
        _id: 'someid',
        name: 'Car B',
        year: 2020,
        chassisNumber: 'XYZ',
        __v: 0,
      } as any);

      const res = await request(app)
        .post('/cars')
        .field('name', 'Car B')
        .field('year', '2020')
        .field('chassisNumber', 'XYZ');

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        _id: 'someid',
        name: 'Car B',
        year: 2020,
        chassisNumber: 'XYZ',
        __v: 0,
      });
    });

    it('should handle invalid data', async () => {
      mockedCreate.mockRejectedValue(new Error('Invalid data'));

      const res = await request(app).post('/cars').send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid data');
    });
  });
});
