import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import HistoryForm from './historyForm';
import './carHistory.css';

const API_BASE = "http://localhost:5001";

// Define types
interface HistoryEvent {
  _id: string;
  title: string;
  description: string;
  date: string;
}

interface Car {
  _id: string;
  name: string;
  year: number;
  chassisNumber: string;
  imageUrl?: string;
  history: HistoryEvent[];
}

interface RouteParams {
  id: string;
}

function CarHistory() {
  const { id } = useParams() as { id: string };
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCar = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/cars/${id}`);
      if (!response.ok) throw new Error("Error fetching car history");
      const data: Car = await response.json();
      setCar(data);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCar();
  }, [fetchCar]);

  async function handleHistoryAdded(): Promise<void> {
    await fetchCar();
  }

  async function handleDeleteHistory(eventId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/cars/${id}/history/${eventId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      await fetchCar();
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    }
  }

  if (loading) return <p>Loading history...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="history-container">
      <div className="car-details">
        {car?.imageUrl && (
          <img
            src={`http://localhost:5001${car.imageUrl}`}
            alt={car.name}
            className="car-image"
          />
        )}
        <div className="title">
          <h1>{car?.year} {car?.name}</h1>
          <h3>{car?.chassisNumber}</h3>
        </div>
        <div className="history-form">
          <h2>Add History Event</h2>
          <HistoryForm carId={id!} onHistoryAdded={handleHistoryAdded} />
        </div>
      </div>
      <div className="car-history">
        {[...(car?.history || [])]
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .map((event) => (
            <li className="history-list" key={event._id}>
              <div className="line">|</div>
              <h3>{event.title}</h3>
              <p>{new Date(event.date).toLocaleDateString()}</p>
              <p>{event.description}</p>
              <button
                className="delete-button"
                onClick={() => handleDeleteHistory(event._id)}
              >
                Delete
              </button>
            </li>
          ))}
      </div>
    </div>
  );
}

export default CarHistory;
