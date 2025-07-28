import React from 'react';
import { Link } from 'react-router-dom';

export default function CarItem({ car }) {
  return (
    <li className="car-card">

      <h2>{car.name}</h2>

      <p>
        {car.year}
      </p>
      <p>{car.chassisNumber}</p>
      <div key={car._id}>
        <Link to={`/cars/${car._id}`}>
        <p>View history</p>
        </Link>
      </div>
    </li>
  );
}