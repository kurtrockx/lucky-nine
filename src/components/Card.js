export function Card({ card }) {
  return (
    <li className="card">
      <img src={card.image} alt={card.value} />
    </li>
  );
}
