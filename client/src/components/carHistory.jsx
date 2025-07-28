import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HistoryForm from './historyForm';
import './carHistory.css';

const API_BASE = "http://localhost:5001";

function CarHistory() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCar = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/cars/${id}`);
      if (!response.ok) throw new Error("Error fetching car history");
      const data = await response.json();
      setCar(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCar();
  }, [fetchCar]);

  async function handleHistoryAdded() {
    await fetchCar();
  }

  if (loading) return <p>No history has been found for this car...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="history-container">
      <h1>{car.year} {car.name}</h1>
      <h3>{car.chassisNumber}</h3>
      <div className="history-form">
        <h2>Add History Event</h2>
        <HistoryForm carId={id} onHistoryAdded={handleHistoryAdded} />
      </div>
      <div className="car-history">

          {car.history.map((event, index) => (
            <li key={index}>
              <h3>{event.title}</h3>
              <p>{new Date(event.date).toLocaleDateString()}</p>
              <p>{event.description}</p>
            </li>
          ))}
        
      </div>
    </div>
  );
}

export default CarHistory;