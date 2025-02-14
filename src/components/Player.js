import { useRef, useEffect } from "react";
import { Cards } from "./Cards";
import { PlayerMenu } from "./PlayerMenu";

export function Player({
  setLives, lives, drawCards, setGameStarted, gameStarted, setPlayerLost, playerLost, setScore, setPlayerCards, playerCards, setOppCards, oppCards, setPlayerValue, playerValue, setOppValue, oppValue,
}) {
  const drew = useRef(false);
  const challenged = useRef(false);

  function valueConvertion(arrValue) {
    const playerCardValues = arrValue.map((c) => c.value);
    const currValue = playerCardValues.reduce((acc, curr) => {
      if (!curr) return acc;
      if (curr === "ACE") return Number(acc) + 1;
      if (curr === "JACK" ||
        curr === "QUEEN" ||
        curr === "KING" ||
        curr === "10")
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
        onReset={handleReset} />
      <Cards cards={playerCards} />
    </div>
  );
}
