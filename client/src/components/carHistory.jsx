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

  useEffect(() => {
    async function fetchCar() {
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
    }
    fetchCar();
  }, [id]);

 if (loading) return <p>Loading car history...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="history-box">
      <div className="history-form">
        <HistoryForm carId={id} />
      </div>
      <div className="car-history">
        <h2>{car.name} History</h2>
        <p>Year: {car.year}</p>


      </div>
    </div>
  );
}

export default CarHistory;