import "./index.css";
import { useState } from "react";

const drawCard = async (count) => {
  const res = await fetch(
    `https://deckofcardsapi.com/api/deck/new/draw/?count=${count}`
  );
  const data = await res.json();
  const cards = data.cards;
  console.log(cards);
  return cards;
};

drawCard(52);
export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [oppValue, setOppValue] = useState("X");
  const [playerValue, setPlayerValue] = useState(0);
  const playerLost = oppValue > playerValue;

  return (
    <div className="app">
      <Opponent
        oppValue={oppValue}
        gameStarted={gameStarted}
        playerLost={playerLost}
        score={score}
      />
      <Player
        setGameStarted={setGameStarted}
        gameStarted={gameStarted}
        setPlayerValue={setPlayerValue}
        playerValue={playerValue}
        playerLost={playerLost}
      />
    </div>
  );
}

function Opponent({ gameStarted, oppValue, score, playerLost }) {
  const [oppCards, setOppCards] = useState([0, 0, 0]);

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

function Player({
  setPlayerValue,
  playerValue,
  setGameStarted,
  gameStarted,
  playerLost,
}) {
  const [playerCards, setPlayerCards] = useState([0, 0, 0]);

  function valueConvertion(arrValue) {
    const playerCardValues = arrValue.map((c) => c.value);
    const currValue = playerCardValues.reduce((acc, curr) => {
      if (!curr) return acc;
      if (curr === "ACE") return Number(acc) + 1;
      if (
        curr === "JACK" ||
        curr === "QUEEN" ||
        curr === "KING" ||
        curr === "10"
      )
        return acc;
      if (acc < 1) return curr;
      if (acc < 1 && curr < 1) return 0;
      return Number(acc) + Number(curr);
    }, 0);

    return currValue;
  }

  async function handleInitCards() {
    const twoCards = await drawCard(2);
    setPlayerCards([...twoCards, { value: 0 }]);

    const playerCardValues = valueConvertion([...twoCards, { value: 0 }]);
    setPlayerValue(() => {
      if (playerCardValues > 9) {
        return playerCardValues % 10;
      }
      return playerCardValues;
    });
  }

  async function handleDrawCard() {
    if (playerCards[2].code) return;
    const currentPlayerCards = playerCards.slice(0, 2);
    const plusOneCard = await drawCard(1);
    currentPlayerCards.push(...plusOneCard);
    setPlayerCards(currentPlayerCards);

    const playerCardValues = valueConvertion(currentPlayerCards);
    setPlayerValue(() => {
      if (playerCardValues > 9) {
        return playerCardValues % 10;
      }
      return playerCardValues;
    });
  }

  return (
    <div className="player-container player">
      <PlayerMenu
        setGameStarted={setGameStarted}
        gameStarted={gameStarted}
        playerValue={playerValue}
        playerLost={playerLost}
        onInitCards={handleInitCards}
        onDrawCard={handleDrawCard}
      />
      <Cards cards={playerCards} />
    </div>
  );
}
function PlayerMenu({
  onInitCards,
  setGameStarted,
  gameStarted,
  playerValue,
  playerLost,
  onDrawCard,
  challenge,
}) {
  return (
    <div className="player-menu">
      {gameStarted && (
        <button className="menu-button menu-button-draw" onClick={onDrawCard}>
          Draw a card
        </button>
      )}
      {gameStarted ? (
        <p className="value">{playerValue}</p>
      ) : (
        <button
          className="start-game-button"
          onClick={() => {
            setGameStarted(true);
            onInitCards();
          }}
        >
          {playerLost ? "Try again?" : "Start Game"}
        </button>
      )}
      {gameStarted && (
        <button
          className="menu-button menu-button-challenge"
          onClick={challenge}
        >
          Challenge
        </button>
      )}
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
