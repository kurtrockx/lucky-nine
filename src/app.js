import "./index.css";
import { useEffect, useRef, useState } from "react";

const drawCards = async (count) => {
  const res = await fetch(
    `https://deckofcardsapi.com/api/deck/new/draw/?count=${count}`
  );
  const data = await res.json();
  const cards = data.cards;
  console.log(cards);
  return cards;
};

drawCards(52);
export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [oppValue, setOppValue] = useState("X");
  const [playerValue, setPlayerValue] = useState(0);
  const [playerLost, setPlayerLost] = useState(false);
  const [playerCards, setPlayerCards] = useState([0, 0, 0]);
  const [oppCards, setOppCards] = useState([0, 0, 0]);

  return (
    <div className="app">
      <Opponent
        oppCards={oppCards}
        oppValue={oppValue}
        gameStarted={gameStarted}
        playerLost={playerLost}
        score={score}
      />
      <Player
        setGameStarted={setGameStarted}
        gameStarted={gameStarted}
        setScore={setScore}
        setPlayerLost={setPlayerLost}
        playerLost={playerLost}
        setOppCards={setOppCards}
        oppCards={oppCards}
        setPlayerCards={setPlayerCards}
        playerCards={playerCards}
        setPlayerValue={setPlayerValue}
        playerValue={playerValue}
        setOppValue={setOppValue}
        oppValue={oppValue}
      />
      <Score score={score} gameStarted={gameStarted} />
    </div>
  );
}

function Opponent({ gameStarted, oppCards, oppValue, score, playerLost }) {
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
  setGameStarted,
  gameStarted,
  setPlayerLost,
  playerLost,
  setScore,
  setPlayerCards,
  playerCards,
  setOppCards,
  oppCards,
  setPlayerValue,
  playerValue,
  setOppValue,
  oppValue,
}) {
  const challenged = useRef(false);

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

    return +currValue;
  }

  async function handleInitCards() {
    const twoCards = await drawCards(2);
    setPlayerCards([...twoCards, { value: 0 }]);

    const playerCardValues = valueConvertion([...twoCards, { value: 0 }]);
    setPlayerValue(
      playerCardValues > 9 ? playerCardValues % 10 : playerCardValues
    );
  }

  async function handleDrawCards() {
    if (playerCards[2].code) return;
    const currentPlayerCards = playerCards.slice(0, 2);
    const plusOneCard = await drawCards(1);
    currentPlayerCards.push(...plusOneCard);
    setPlayerCards(currentPlayerCards);

    const playerCardValues = valueConvertion(currentPlayerCards);
    setPlayerValue(
      playerCardValues > 9 ? playerCardValues % 10 : playerCardValues
    );
  }

  async function handleOppCards() {
    if (challenged.current === false) {
      challenged.current = true;
      const drawOppCards = await drawCards(3);
      setOppCards(drawOppCards);
      const oppCardValues = valueConvertion(drawOppCards);
      setOppValue(oppCardValues > 9 ? oppCardValues % 10 : oppCardValues);
    }
  }

  function handleChallenge() {
    setTimeout(() => {
      if (playerValue > oppValue) {
        handleNextLevel();
      } else if (playerValue < oppValue) {
        setGameStarted(false);
        setPlayerLost(true);
      } else {
        handleReset();
        handleInitCards();
      }
    }, 2000);
  }

  useEffect(() => {
    if (oppValue !== "X") {
      handleChallenge();
    }
  }, [oppValue]);

  function handleReset() {
    setPlayerCards([0, 0, 0]);
    setOppCards([0, 0, 0]);
    setPlayerValue(0);
    setOppValue("X");
  }

  function handleNextLevel() {
    handleReset();
    handleInitCards();
    setScore((s) => s + 1);
  }
  return (
    <div className="player-container player">
      <PlayerMenu
        setGameStarted={setGameStarted}
        gameStarted={gameStarted}
        playerValue={playerValue}
        playerLost={playerLost}
        setScore={setScore}
        onInitCards={handleInitCards}
        onDrawCards={handleDrawCards}
        onOppCards={handleOppCards}
        setPlayerLost={setPlayerLost}
        onReset={handleReset}
      />
      <Cards cards={playerCards} />
    </div>
  );
}
function PlayerMenu({
  setGameStarted,
  gameStarted,
  setPlayerLost,
  playerLost,
  setScore,
  playerValue,
  onOppCards,
  onReset,
  onInitCards,
  onDrawCards,
}) {
  return (
    <div className="player-menu">
      {gameStarted && (
        <button className="menu-button menu-button-draw" onClick={onDrawCards}>
          Draw a card
        </button>
      )}
      {gameStarted ? (
        <p className="value">{playerValue}</p>
      ) : (
        <button
          className="start-game-button"
          onClick={() => {
            if (playerLost) {
              onReset();
              setPlayerLost(false);
              return;
            }
            setScore(0);
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
          onClick={onOppCards}
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
      <img src={card.image} alt={card.value} />
    </li>
  );
}

function Score({ score, gameStarted }) {
  return (
    <div className="top-score">
      {!gameStarted
        ? ""
        : score < 10
        ? score.toString().padStart(2, "0")
        : score}
    </div>
  );
}
