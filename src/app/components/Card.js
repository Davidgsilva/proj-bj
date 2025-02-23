import { Card as UICard, CardContent } from '@/components/ui/card';

export const PlayingCard = ({ card, isDealer, index, isNewCard, isHidden }) => {
  return (
    <UICard 
      className={`w-20 h-32 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-500 absolute
        ${isNewCard ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}
      style={{ 
        left: `${index * 55}px`, 
        zIndex: index
      }}
    >
      <CardContent className={`text-2xl ${isHidden ? 'bg-blue-800 w-full h-full flex items-center justify-center text-white' : ['♥', '♦'].includes(card.suit) ? 'text-red-500' : 'text-black'}`}>
        {isHidden ? '?' : card.value + card.suit}
      </CardContent>
    </UICard>
  );
};