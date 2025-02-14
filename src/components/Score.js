export function Score({ score, gameStarted }) {
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
