import "./index.css";
import { useEffect, useRef, useState } from "react";

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [oppValue, setOppValue] = useState("X");
  const [playerValue, setPlayerValue] = useState(0);
  const [playerLost, setPlayerLost] = useState(false);
  const [playerCards, setPlayerCards] = useState([0, 0, 0]);
  const [oppCards, setOppCards] = useState([0, 0, 0]);
  const [toggledFaceCards, setToggledFaceCards] = useState(true);
  const [lives, setLives] = useState(3);

  const drawCards = async (count) => {
    if (toggledFaceCards === true) {
      const res = await fetch(
        `https://deckofcardsapi.com/api/deck/new/draw/?count=${count}`
      );

      const data = await res.json();
      const cards = data.cards;
      return cards;
    }

    const customCards = [
      "AS",
      "AH",
      "AD",
      "AC",
      "2S",
      "3S",
      "4S",
      "5S",
      "6S",
      "7S",
      "8S",
      "9S",
      "10S",
      "2H",
      "3H",
      "4H",
      "5H",
      "6H",
      "7H",
      "8H",
      "9H",
      "10H",
      "2D",
      "3D",
      "4D",
      "5D",
      "6D",
      "7D",
      "8D",
      "9D",
      "10D",
      "2C",
      "3C",
      "4C",
      "5C",
      "6C",
      "7C",
      "8C",
      "9C",
      "10C",
    ].join(",");

    const deckUrl = `https://deckofcardsapi.com/api/deck/new/shuffle/?cards=${customCards}`;
    const deckResponse = await fetch(deckUrl);
    const deckData = await deckResponse.json();
    const deckId = deckData.deck_id;

    const res = await fetch(
      `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`
    );
    const data = await res.json();
    const cards = data.cards;
    return cards;
  };

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
        setLives={setLives}
        lives={lives}
        drawCards={drawCards}
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
      <FaceCardsButton
        gameStarted={gameStarted}
        playerLost={playerLost}
        setToggledFaceCards={setToggledFaceCards}
        toggledFaceCards={toggledFaceCards}
        drawCards={drawCards}
      />
      <Lives gameStarted={gameStarted} lives={lives} />
    </div>
  );
}

function FaceCardsButton({
  setToggledFaceCards,
  toggledFaceCards,
  drawCards,
  gameStarted,
  playerLost,
}) {
  return (
    <>
      {!gameStarted && !playerLost && (
        <div
          onClick={() => setToggledFaceCards((f) => !f)}
          className={`face-card-button ${
            toggledFaceCards ? "face-cards-on" : "face-cards-off"
          }`}
        >
          <div
            className={`toggle-element ${
              toggledFaceCards ? "toggled-on" : "toggled-off"
            }`}
          ></div>
        </div>
      )}
    </>
  );
}
function Lives({ gameStarted, lives }) {
  return (
    <>
      {gameStarted && lives > 0 && (
        <div className="lives-container">
          {Array.from({ length: lives }, (_, i) => {
            return (
              <img
                src="https://png.pngtree.com/png-vector/20220428/ourmid/pngtree-smooth-glossy-heart-vector-file-ai-and-png-png-image_4557871.png"
                alt={`heart-${i}`}
              />
            );
          })}
        </div>
      )}
    </>
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
  setLives,
  lives,
  drawCards,
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
  const drew = useRef(false);
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
    if (drew.current === true) return;
    drew.current = true;
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
        setLives((l) => l - 1);
        if (lives > 1) {
          handleReset();
          handleInitCards();
          return;
        }
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
    drew.current = false;
    challenged.current = false;
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
        setLives={setLives}
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
  setLives,
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
            setLives(3);
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
