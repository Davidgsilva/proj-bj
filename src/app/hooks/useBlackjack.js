import { useState } from 'react';
import { createDeck, shuffleDeck, calculateHandValue, canSplit } from '../utils/cardUtils';

export const useBlackjack = () => {
  const [deck, setDeck] = useState([]);
  const [playerHands, setPlayerHands] = useState([[]]);
  const [currentHandIndex, setCurrentHandIndex] = useState(0);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameStatus, setGameStatus] = useState('waiting');
  const [gameResult, setGameResult] = useState('');
  const [newCardIndex, setNewCardIndex] = useState(-1);
  const [canDouble, setCanDouble] = useState(false);
  const [canSurrender, setCanSurrender] = useState(false);

  const dealCards = async () => {
    const newDeck = shuffleDeck(createDeck());
    setDeck(newDeck);
    setGameStatus('dealing');
    
    setNewCardIndex(0);
    setPlayerHands([[newDeck[0]]]);
    await new Promise(resolve => setTimeout(resolve, 500));
    setNewCardIndex(-1);
    
    setNewCardIndex(0);
    setDealerHand([newDeck[1]]);
    await new Promise(resolve => setTimeout(resolve, 500));
    setNewCardIndex(-1);
    
    setNewCardIndex(1);
    const playerInitialHand = [newDeck[0], newDeck[2]];
    setPlayerHands([playerInitialHand]);
    await new Promise(resolve => setTimeout(resolve, 500));
    setNewCardIndex(-1);
    
    setNewCardIndex(1);
    const dealerInitialHand = [newDeck[1], newDeck[3]];
    setDealerHand(dealerInitialHand);
    await new Promise(resolve => setTimeout(resolve, 500));
    setNewCardIndex(-1);

    const playerValue = calculateHandValue(playerInitialHand);
    const dealerValue = calculateHandValue(dealerInitialHand);

    if (playerValue === 21 && dealerValue === 21) {
      setGameStatus('ended');
      setGameResult('Push - both have Blackjack!');
    } else if (playerValue === 21) {
      setGameStatus('ended');
      setGameResult('Blackjack! You win!');
    } else if (dealerValue === 21) {
      setGameStatus('ended');
      setGameResult('Dealer has Blackjack! Dealer wins!');
    } else {
      setGameStatus('playing');
      setCanDouble(true);
      setCanSurrender(true);
    }
  };

  const dealerTurn = async () => {
      setGameStatus('dealer-turn');
      let currentDealerHand = [...dealerHand];
      let currentIndex = playerHands.flat().length + dealerHand.length;
      
      console.log('Initial dealer hand:', JSON.stringify(currentDealerHand));
      const initialDealerValue = calculateHandValue(currentDealerHand);
      console.log('Initial dealer value:', initialDealerValue);
      
      while (calculateHandValue(currentDealerHand) < 17) {
          console.log('Dealer drawing card (under 17)');
          setNewCardIndex(currentDealerHand.length);
          currentDealerHand = [...currentDealerHand, deck[currentIndex]];
          console.log('Drew card:', JSON.stringify(deck[currentIndex]));
          console.log('New dealer hand:', JSON.stringify(currentDealerHand));
          const newValue = calculateHandValue(currentDealerHand);
          console.log('New dealer value:', newValue);
          setDealerHand(currentDealerHand);
          await new Promise(resolve => setTimeout(resolve, 500));
          setNewCardIndex(-1);
          currentIndex++;
      }

      setGameStatus('ended');
      const dealerValue = calculateHandValue(currentDealerHand);
      console.log('Final dealer hand:', JSON.stringify(currentDealerHand));
      console.log('Final dealer value:', dealerValue);
      
      if (dealerValue > 21) {
          console.log('Dealer busts!');
          setGameResult('Dealer busts! You win!');
      } else {
          console.log('Checking player hands...');
          // Get fresh copy of player hands to ensure we have the most up-to-date state
          const currentPlayerHands = [...playerHands];
          const results = currentPlayerHands.map((hand, index) => {
              console.log(`Complete player hand ${index}:`, JSON.stringify(hand));
              const handValue = calculateHandValue(hand);
              console.log(`Player hand ${index} complete value:`, handValue);
              console.log(`Comparing dealer (${dealerValue}) vs player (${handValue})`);

              if (handValue > 21) {
                  console.log('Player busts - lose');
                  return 'lose';
              }
              if (dealerValue === handValue) {
                  console.log('Equal values - push');
                  return 'push';
              }
              if (dealerValue > handValue) {
                  console.log('Dealer higher - lose');
                  return 'lose';
              }
              console.log('Player higher - win');
              return 'win';
          });
          
          console.log('All results:', results);
          const uniqueResults = [...new Set(results)];
          console.log('Unique results:', uniqueResults);

          if (uniqueResults.length === 1) {
              const result = uniqueResults[0] === 'win' ? 'You win!' :
                            uniqueResults[0] === 'lose' ? 'Dealer wins!' :
                            'Push - it\'s a tie!';
              console.log('Final result:', result);
              setGameResult(result);
          } else {
              const result = 'Split hands: ' + results.map((result, i) => `Hand ${i + 1} - ${result}`).join(', ');
              console.log('Split hands result:', result);
              setGameResult(result);
          }
      }
  };

  const hit = async () => {
    if (gameStatus !== 'playing') return;
    setCanDouble(false);
    setCanSurrender(false);

    const totalCards = playerHands.flat().length + dealerHand.length;
    const newCard = deck[totalCards];
    setGameStatus('dealing');
    setNewCardIndex(playerHands[currentHandIndex].length);
    
    const updatedHands = [...playerHands];
    updatedHands[currentHandIndex] = [...updatedHands[currentHandIndex], newCard];
    setPlayerHands(updatedHands);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setNewCardIndex(-1);

    const currentHandValue = calculateHandValue(updatedHands[currentHandIndex]);
    
    if (currentHandValue > 21) {
      if (currentHandIndex < playerHands.length - 1) {
        setCurrentHandIndex(currentHandIndex + 1);
        setGameStatus('playing');
      } else {
        setGameStatus('ended');
        setGameResult('Bust! Dealer wins!');
      }
    } else if (currentHandValue === 21) {
      if (currentHandIndex < playerHands.length - 1) {
        setCurrentHandIndex(currentHandIndex + 1);
        setGameStatus('playing');
      } else {
        await dealerTurn();
      }
    } else {
      setGameStatus('playing');
    }
  };

  const stand = async () => {
    if (gameStatus !== 'playing') return;
    
    if (currentHandIndex < playerHands.length - 1) {
      setCurrentHandIndex(currentHandIndex + 1);
      setGameStatus('playing');
      setCanDouble(true);
    } else {
      await dealerTurn();
    }
  };

  const double = async () => {
    if (!canDouble || gameStatus !== 'playing') return;
    
    const totalCards = playerHands.flat().length + dealerHand.length;
    const newCard = deck[totalCards];
    setGameStatus('dealing');
    setNewCardIndex(playerHands[currentHandIndex].length);
    
    const updatedHands = [...playerHands];
    updatedHands[currentHandIndex] = [...updatedHands[currentHandIndex], newCard];
    setPlayerHands(updatedHands);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setNewCardIndex(-1);

    const currentHandValue = calculateHandValue(updatedHands[currentHandIndex]);
    
    if (currentHandValue > 21) {
      setGameStatus('ended');
      setGameResult('Bust! Dealer wins!');
    } else if (currentHandIndex < playerHands.length - 1) {
      setCurrentHandIndex(currentHandIndex + 1);
      setGameStatus('playing');
    } else {
      await dealerTurn();
    }
  };

  const surrender = () => {
    if (!canSurrender || gameStatus !== 'playing') return;
    setGameStatus('ended');
    setGameResult('Surrendered - lose half bet');
  };

  const split = async () => {
    if (!canSplit(playerHands[currentHandIndex]) || gameStatus !== 'playing') return;
    
    const handToSplit = playerHands[currentHandIndex];
    const updatedHands = [...playerHands];
    
    updatedHands[currentHandIndex] = [handToSplit[0]];
    updatedHands.splice(currentHandIndex + 1, 0, [handToSplit[1]]);
    
    setPlayerHands(updatedHands);
    
    const totalCards = updatedHands.flat().length + dealerHand.length;
    const newCard = deck[totalCards];
    
    setNewCardIndex(1);
    updatedHands[currentHandIndex].push(newCard);
    setPlayerHands(updatedHands);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setNewCardIndex(-1);
    
    setGameStatus('playing');
    setCanDouble(true);
  };

  return {
    playerHands,
    currentHandIndex,
    dealerHand,
    gameStatus,
    gameResult,
    newCardIndex,
    canDouble,
    canSurrender,
    actions: {
      startNewGame: () => {
        setPlayerHands([[]]);
        setCurrentHandIndex(0);
        setDealerHand([]);
        setGameResult('');
        setNewCardIndex(-1);
        setCanDouble(false);
        setCanSurrender(false);
        dealCards();
      },
      hit,
      stand,
      double,
      surrender,
      split
    }
  };
};