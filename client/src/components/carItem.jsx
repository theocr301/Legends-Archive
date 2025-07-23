export default function CarItem({ car }) {
  return (
    <li className="car-item">

      <h2>{car.name}</h2>

      <p>
        {car.year}
      </p>
      <p>{car.chassisNumber}</p>
    </li>
  );
}