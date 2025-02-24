import { Card as UICard, CardContent } from '@/components/ui/card';

export const PlayingCard = ({ 
  card, 
  isDealer, 
  index, 
  isNewCard, 
  isHidden, 
  totalCards = 2,
  resultStatus = null 
}) => {
  // Get border color based on result
  const getBorderStyle = () => {
    if (!resultStatus) return '';
    
    const borderColors = {
      push: 'border-[var(--yellow-500)]',
      lose: 'border-[var(--red-500)]',
      win: 'border-[var(--green-400)]'
    };
    
    return borderColors[resultStatus];
  };

  return (
    <UICard 
      className={`w-20 h-32 flex items-start justify-start shadow-lg hover:shadow-xl transition-all duration-500 absolute
        ${isNewCard ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}
        ${getBorderStyle()}
        ${resultStatus ? 'border-3' : 'border'}`}
      style={{ 
        left: `calc(50% + ${index * 20}px)`,
        top: `${index * 20}px`,
        transform: 'translateX(-50%)',
        zIndex: index
      }}
    >
      <CardContent 
        className={`p-2 text-2xl ${
          isHidden 
            ? 'bg-blue-800 w-full h-full flex items-center justify-center text-white' 
            : ['♥', '♦'].includes(card.suit) 
              ? 'text-red-500' 
              : 'text-black'
        }`}
      >
        {isHidden ? '?' : card.value + card.suit}
      </CardContent>
    </UICard>
  );
};