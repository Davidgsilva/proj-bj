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
  const isPlaying = gameStatus === 'playing';
  
  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      {/* New Game / Play Again button */}

      {/* Game action buttons */}
      <button
        onClick={onHit}
        disabled={!isPlaying}
        className={`px-4 py-2 player-action-btn py-[.9375rem] px-[1.25rem] text-white font-extrabold text-xs rounded w-full ${!isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Hit
      </button>
      
      <button
        onClick={onStand}
        disabled={!isPlaying}
        className={`px-4 py-2 player-action-btn py-[.9375rem] px-[1.25rem] text-white font-extrabold text-xs rounded w-full ${!isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Stand
      </button>
      
      <button
        onClick={onDouble}
        disabled={!isPlaying || !canDouble}
        className={`px-4 py-2 player-action-btn py-[.9375rem] px-[1.25rem] text-white font-extrabold text-xs rounded w-full ${!isPlaying || !canDouble ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Double
      </button>
      
      <button
        onClick={onSurrender}
        disabled={!isPlaying || !canSurrender}
        className={`px-4 py-2 py-[.9375rem] px-[1.25rem] player-action-btn text-white font-extrabold text-xs rounded w-full ${!isPlaying || !canSurrender ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Surrender
      </button>
      
      <button
        onClick={onSplit}
        disabled={!isPlaying || !canSplitHand}
        className={`px-4 py-2 py-[.9375rem] px-[1.25rem] player-action-btn text-white font-extrabold text-xs rounded w-full ${!isPlaying || !canSplitHand ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Split
      </button>

      <button
        onClick={onNewGame}
        className={`px-4 py-2 py-[1.123rem] px-[1.75rem] font-extrabold text-sm bg-green-500 hover:bg-green-600 text-black rounded col-span-2 ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isPlaying}
      >
        Play
      </button>

    </div>
  );
};