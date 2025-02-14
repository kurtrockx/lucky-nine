export function PlayerMenu({
  setLives, setGameStarted, gameStarted, setPlayerLost, playerLost, setScore, playerValue, onOppCards, onReset, onInitCards, onDrawCards,
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
