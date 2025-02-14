import "./index.css";
import { useState } from "react";
import { FaceCardsButton } from "./components/FaceCardsButton";
import { Lives } from "./components/Lives";
import { Score } from "./components/Score";
import { Player } from "./components/Player";
import { Opponent } from "./components/Opponent";

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
