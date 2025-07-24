export default function CarItem({ car }) {
  return (
    <li className="car-card">

      <h2>{car.name}</h2>

      <p>
        {car.year}
      </p>
      <p>{car.chassisNumber}</p>
    </li>
  );
}