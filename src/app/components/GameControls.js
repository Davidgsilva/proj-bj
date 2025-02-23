export const GameControls = ({ 
  gameStatus,
  onHit,
  onStand,
  onDouble,
  onSurrender,
  onSplit,
  canDouble,
  canSurrender,
  canSplitHand,
  onNewGame
}) => {
  if (gameStatus === 'waiting') {
    return (
      <button
        onClick={onNewGame}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Start New Game
      </button>
    );
  }

  if (gameStatus === 'ended') {
    return (
      <button
        onClick={onNewGame}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Play Again
      </button>
    );
  }

  if (gameStatus === 'playing') {
    return (
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={onHit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Hit
        </button>
        <button
          onClick={onStand}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Stand
        </button>
        {canDouble && (
          <button
            onClick={onDouble}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Double
          </button>
        )}
        {canSurrender && (
          <button
            onClick={onSurrender}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Surrender
          </button>
        )}
        {canSplitHand && (
          <button
            onClick={onSplit}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Split
          </button>
        )}
      </div>
    );
  }

  return null;
};