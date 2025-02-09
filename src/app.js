import "./index.css";
import { useEffect, useState } from "react";

const drawCard = async (count) => {
  const res = await fetch(
    `https://deckofcardsapi.com/api/deck/new/draw/?count=${count}`
  );
  const data = await res.json();
  const cards = data.cards;
  return cards;
};
export default function App() {
  const [gameStarted, setGameStarted] = useState(true);
  const [score, setScore] = useState(0);
  const [oppCards, setOppCards] = useState([0, 0, 0]);
  const [playerCards, setPlayerCards] = useState([0, 0, 0]);
  const [oppValue, setOppValue] = useState("X");
  const [playerValue, SetPlayerValue] = useState(0);
  const playerLost = oppValue > playerValue;

  async function handlePlayerInitCards() {
    if (!gameStarted) return;
    const cards = await drawCard(2);
    setPlayerCards([...cards, 0]);
  }

  return (
    <div className="app">
      <Opponent
        oppCards={oppCards}
        oppValue={oppValue}
        playerLost={playerLost}
        score={score}
        gameStarted={gameStarted}
      />
      <Player
        playerCards={playerCards}
        playerValue={playerValue}
        playerLost={playerLost}
        gameStarted={gameStarted}
      />
    </div>
  );
}

function Opponent({ oppCards, oppValue, gameStarted, score, playerLost }) {
  return (
    <div className="player-container opponent">
      <Cards cards={oppCards} />

      <p className="value oppValue">
        {gameStarted
          ? oppValue
          : playerLost
          ? `YOUR SCORE: ${score}`
          : "LUCKY 9"}
      </p>
    </div>
  );
}

function Player({ playerCards, playerValue, gameStarted, score, playerLost }) {
  return (
    <div className="player-container player">
      <PlayerMenu playerValue={playerValue} />
      <Cards cards={playerCards} />
    </div>
  );
}
function PlayerMenu({ drawCard, challenge, playerValue }) {
  return (
    <div className="player-menu">
      <button className="menu-button menu-button-draw" onClick={drawCard}>
        Draw a card
      </button>
      <p className="value">{playerValue}</p>
      <button className="menu-button menu-button-challenge" onClick={challenge}>
        Challenge
      </button>
    </div>
  );
}

function Cards({ cards }) {
  return (
    <ul className="cards-container">
      {cards.map((card, i) => (
        <Card card={card} key={i} />
      ))}
    </ul>
  );
}
function Card({ card }) {
  return (
    <li className="card">
      <img src={card.image} alt={card.value}></img>
    </li>
  );
}
