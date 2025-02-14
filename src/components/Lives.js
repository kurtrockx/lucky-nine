export function Lives({ gameStarted, lives }) {
  return (
    <>
      {gameStarted && lives > 0 && (
        <div className="lives-container">
          {Array.from({ length: lives }, (_, i) => {
            return (
              <img
                src="https://png.pngtree.com/png-vector/20220428/ourmid/pngtree-smooth-glossy-heart-vector-file-ai-and-png-png-image_4557871.png"
                alt={`heart-${i}`} />
            );
          })}
        </div>
      )}
    </>
  );
}
