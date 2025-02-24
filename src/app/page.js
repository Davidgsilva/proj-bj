"use client";

import { Hand } from './components/Hand';
import { GameControls } from './components/GameControls';
import { useBlackjack } from './hooks/useBlackjack';
import { canSplit } from './utils/cardUtils';

export default function BlackjackGame() {
  const {
    playerHands,
    currentHandIndex,
    dealerHand,
    gameStatus,
    gameResult,
    newCardIndex,
    canDouble,
    canSurrender,
    actions
  } = useBlackjack();

  return (
    <main className="min-h-screen p-8 flex bg-stake">
      {/* Controls Column */}
      <div className="w-64 flex flex-col gap-4 bg-semi-dark game-sidebar">
        
        <GameControls
          gameStatus={gameStatus}
          onHit={actions.hit}
          onStand={actions.stand}
          onDouble={actions.double}
          onSurrender={actions.surrender}
          onSplit={actions.split}
          canDouble={canDouble}
          canSurrender={canSurrender}
          canSplitHand={canSplit(playerHands[currentHandIndex])}
          onNewGame={actions.startNewGame}
        />

        {/*gameStatus === 'ended' && (
          <div className="text-2xl">{gameResult}</div>
        )*/}
      </div>

      {/* Game Area */}
      <div className="flex-1 flex flex-col items-center bg-dark justify-center">
        {gameStatus !== 'waiting' && (
          <>
            <Hand
              title=""
              cards={dealerHand}
              isDealer={true}
              gameStatus={gameStatus}
              newCardIndex={newCardIndex}
              gameResult={gameResult}
            />

            {playerHands.map((hand, handIndex) => (
              <Hand
                key={handIndex}
                title=""
                cards={hand}
                isDealer={false}
                gameStatus={gameStatus}
                newCardIndex={newCardIndex}
                currentHand=""
                gameResult={gameResult}
              />
            ))}
          </>
        )}
      </div>
    </main>
  );
}