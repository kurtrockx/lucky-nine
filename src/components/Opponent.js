import { Cards } from "./Cards";

export function Opponent({ gameStarted, oppCards, oppValue, score, playerLost }) {
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
