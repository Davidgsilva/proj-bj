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
    <main className="min-h-screen p-8 flex flex-col items-center">
      <h1 className="text-4xl mb-8">Blackjack</h1>
      
      {gameStatus !== 'waiting' && (
        <>
          <Hand
            title="Dealer's Hand"
            cards={dealerHand}
            isDealer={true}
            gameStatus={gameStatus}
            newCardIndex={newCardIndex}
          />

          {playerHands.map((hand, handIndex) => (
            <Hand
              key={handIndex}
              title={`Hand ${handIndex + 1}`}
              cards={hand}
              isDealer={false}
              gameStatus={gameStatus}
              newCardIndex={newCardIndex}
              currentHand={handIndex === currentHandIndex}
            />
          ))}
        </>
      )}

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

      {gameStatus === 'ended' && (
        <div className="text-2xl mb-4">{gameResult}</div>
      )}
    </main>
  );
}