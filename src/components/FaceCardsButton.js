export function FaceCardsButton({
  setToggledFaceCards, toggledFaceCards, drawCards, gameStarted, playerLost,
}) {
  return (
    <>
      {!gameStarted && !playerLost && (
        <div
          onClick={() => setToggledFaceCards((f) => !f)}
          className={`face-card-button ${toggledFaceCards ? "face-cards-on" : "face-cards-off"}`}
        >
          <div
            className={`toggle-element ${toggledFaceCards ? "toggled-on" : "toggled-off"}`}
          ></div>
        </div>
      )}
    </>
  );
}
