import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

describe('App', () => {
  const mockCars = [
    {
      _id: '1',
      name: 'Ferrari 250 GTO',
      year: 1962,
      chassisNumber: 'GTO-001',
      createdAt: '2024-01-01T00:00:00.000Z',
      imageUrl: '/images/gto.jpg',
    },
    {
      _id: '2',
      name: 'Porsche 917K',
      year: 1970,
      chassisNumber: '917K-042',
      createdAt: '2025-01-01T00:00:00.000Z',
    },
  ];

  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation((url) => {
      if (url.includes('/cars')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCars),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders homepage and displays fetched car cards', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Check initial loading state
    expect(screen.getByText(/The new way to track old racecars/i)).toBeInTheDocument();
    expect(screen.getByText(/Loading cars/i)).toBeInTheDocument();

    // Wait for cars to load and check if they appear
    await waitFor(() => {
      expect(screen.getByText(/Ferrari 250 GTO/)).toBeInTheDocument();
      expect(screen.getByText(/Porsche 917K/)).toBeInTheDocument();
    });
  });

  it('displays error if fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to fetch/)).toBeInTheDocument();
    });
  });
});
