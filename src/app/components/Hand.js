import { PlayingCard } from './Card';
import { calculateHandValue } from '../utils/cardUtils';

export const Hand = ({ 
  title, 
  cards, 
  isDealer, 
  gameStatus, 
  newCardIndex, 
  currentHand = false,
  gameResult = ''
}) => {
  const isCardHidden = (isDealer, cardIndex, gameState) => {
    return isDealer && cardIndex === 1 && (gameState === 'playing' || gameState === 'dealing');
  };

  const getVisibleCards = () => {
    return cards.filter((_, index) => !isCardHidden(isDealer, index, gameStatus));
  };

  const displayValue = isDealer ? calculateHandValue(getVisibleCards()) : calculateHandValue(cards);

  // Only show result when game is ended AND not waiting for new game
  const getResultStatus = () => {
    if (isDealer || gameStatus === 'waiting') return null;
    if (gameStatus !== 'ended') return null;
    
    if (gameResult.includes('Push')) return 'push';
    if (gameResult.includes('Bust') || gameResult.includes('Dealer wins')) return 'lose';
    if (gameResult.includes('You win') || gameResult.includes('Blackjack')) return 'win';
    
    // Handle split hands
    if (gameResult.includes('Split hands:')) {
      const handIndex = currentHand ? 1 : 0;
      if (gameResult.includes(`Hand ${handIndex + 1} - win`)) return 'win';
      if (gameResult.includes(`Hand ${handIndex + 1} - lose`)) return 'lose';
      if (gameResult.includes(`Hand ${handIndex + 1} - push`)) return 'push';
    }
    
    return null;
  };

  return (
    <div className="mb-8 relative">
      <div className="flex flex-col">
        <span className="text-xl">
          {title}
          {currentHand && gameStatus === 'playing' && " - Current Hand"}
        </span>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[var(--grey-400)] text-white font-extrabold px-4 py-1 rounded-full w-16 text-center transform -translate-y-full shadow-sm transition-all duration-300">
          {displayValue}
        </div>
      </div>
      <div className="flex relative h-64 w-96 mx-auto">
        {cards.map((card, index) => (
          <div key={index}>
            <PlayingCard
              card={card}
              isDealer={isDealer}
              index={index}
              isNewCard={index === newCardIndex}
              isHidden={isCardHidden(isDealer, index, gameStatus)}
              totalCards={cards.length}
              resultStatus={getResultStatus()}
            />
          </div>
        ))}
      </div>
    </div>
  );
};