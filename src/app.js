import { useState } from "react";

const drawCard = async (count) => {
  const res = await fetch(
    `https://deckofcardsapi.com/api/deck/new/draw/?count=${count}`
  );
  const data = await res.json();
  console.log(data);
};

drawCard(2);

export default function App() {
  const [oppCards, setOppCards] = useState([]);
  const [playerCards, setPlayerCards] = useState([]);
  return (
    <div className="app">
      <Opponent oppCards={oppCards} />
      <Player playerCards={playerCards} />
    </div>
  );
}

function Opponent({ oppCards }) {
  return (
    <div className="player-container opponent">
      <Cards cards={oppCards} />
    </div>
  );
}

function Player({ playerCards }) {
  return (
    <div className="player-container player">
      <Cards cards={playerCards} />
    </div>
  );
}

function Cards({ cards }) {
  return (
    <ul className="cards-container">
      {cards.map((card) => (
        <Card card={card} />
      ))}
    </ul>
  );
}
function Card({ card }) {
  return (
    <li>
      <img src={card.image} alt={card.value}></img>
    </li>
  );
}
