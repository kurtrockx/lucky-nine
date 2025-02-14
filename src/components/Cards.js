import { Card } from "./Card";

export function Cards({ cards }) {
  return (
    <ul className="cards-container">
      {cards.map((card, i) => (
        <Card card={card} key={i} />
      ))}
    </ul>
  );
}
