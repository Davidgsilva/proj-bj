import { PlayingCard } from './Card';
import { calculateHandValue } from '../utils/cardUtils';

export const Hand = ({ title, cards, isDealer, gameStatus, newCardIndex, currentHand = false }) => {
  const isCardHidden = (isDealer, cardIndex, gameState) => {
    return isDealer && cardIndex === 1 && (gameState === 'playing' || gameState === 'dealing');
  };

  const getVisibleCards = () => {
    return cards.filter((_, index) => !isCardHidden(isDealer, index, gameStatus));
  };

  const displayValue = isDealer ? calculateHandValue(getVisibleCards()) : calculateHandValue(cards);

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
            />
          </div>
        ))}
      </div>
    </div>
  );
};