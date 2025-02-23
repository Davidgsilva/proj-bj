import { PlayingCard } from './Card';
import { calculateHandValue } from '../utils/cardUtils';

export const Hand = ({ title, cards, isDealer, gameStatus, newCardIndex, currentHand = false }) => {
  const isCardHidden = (isDealer, cardIndex, gameState) => {
    return isDealer && cardIndex === 1 && (gameState === 'playing' || gameState === 'dealing');
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl mb-2">
        {title} ({calculateHandValue(cards)})
        {currentHand && gameStatus === 'playing' && " - Current Hand"}
      </h2>
      <div className="flex relative h-40 w-96 overflow-hidden mx-auto">
        {cards.map((card, index) => (
          <div key={index}>
            <PlayingCard
              card={card}
              isDealer={isDealer}
              index={index}
              isNewCard={index === newCardIndex}
              isHidden={isCardHidden(isDealer, index, gameStatus)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};