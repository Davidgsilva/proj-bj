"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const createDeck = () => {
  const suits = ['♠', '♣', '♥', '♦'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck = [];

  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value });
    }
  }
  return deck;
};

const shuffleDeck = (deck) => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const calculateHandValue = (hand) => {
  let value = 0;
  let aces = 0;

  for (const card of hand) {
    if (card.value === 'A') {
      aces += 1;
      value += 11;
    } else if (['K', 'Q', 'J'].includes(card.value)) {
      value += 10;
    } else {
      value += parseInt(card.value);
    }
  }

  while (value > 21 && aces > 0) {
    value -= 10;
    aces -= 1;
  }

  return value;
};

const canSplit = (hand) => {
  if (hand.length !== 2) return false;
  const [card1, card2] = hand;
  return card1.value === card2.value;
};

export default function BlackjackGame() {
  const [deck, setDeck] = useState([]);
  const [playerHands, setPlayerHands] = useState([[]]);  // Array of hands for splitting
  const [currentHandIndex, setCurrentHandIndex] = useState(0);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameStatus, setGameStatus] = useState('waiting'); // waiting, dealing, playing, dealer-turn, ended
  const [gameResult, setGameResult] = useState('');
  const [newCardIndex, setNewCardIndex] = useState(-1);
  const [canDouble, setCanDouble] = useState(false);
  const [canSurrender, setCanSurrender] = useState(false);

  const dealCards = async () => {
    const newDeck = shuffleDeck(createDeck());
    setDeck(newDeck);
    setGameStatus('dealing');
    
    // Deal cards one at a time with animation
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

    // Check for initial blackjacks
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

  const startNewGame = () => {
    setPlayerHands([[]]);
    setCurrentHandIndex(0);
    setDealerHand([]);
    setGameResult('');
    setNewCardIndex(-1);
    setCanDouble(false);
    setCanSurrender(false);
    dealCards();
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

  const double = async () => {
    if (!canDouble || gameStatus !== 'playing') return;
    
    // Deal exactly one card and then end the hand
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
    
    // Create two new hands from the split cards
    updatedHands[currentHandIndex] = [handToSplit[0]];
    updatedHands.splice(currentHandIndex + 1, 0, [handToSplit[1]]);
    
    setPlayerHands(updatedHands);
    
    // Deal one new card to the first hand
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

  const dealerTurn = async () => {
    setGameStatus('dealer-turn');
    let currentDealerHand = [...dealerHand];
    let currentIndex = playerHands.flat().length + dealerHand.length;
    
    while (calculateHandValue(currentDealerHand) < 17) {
      setNewCardIndex(currentDealerHand.length);
      currentDealerHand = [...currentDealerHand, deck[currentIndex]];
      setDealerHand(currentDealerHand);
      await new Promise(resolve => setTimeout(resolve, 500));
      setNewCardIndex(-1);
      currentIndex++;
    }

    setGameStatus('ended');
    const dealerValue = calculateHandValue(currentDealerHand);
    
    if (dealerValue > 21) {
      setGameResult('Dealer busts! You win!');
    } else {
      // Compare dealer's hand with all player hands
      const results = playerHands.map(hand => {
        const handValue = calculateHandValue(hand);
        if (handValue > 21) return 'lose';
        if (dealerValue > handValue) return 'lose';
        if (dealerValue < handValue) return 'win';
        return 'push';
      });
      
      const uniqueResults = [...new Set(results)];
      if (uniqueResults.length === 1) {
        setGameResult(
          uniqueResults[0] === 'win' ? 'You win!' :
          uniqueResults[0] === 'lose' ? 'Dealer wins!' :
          'Push - it\'s a tie!'
        );
      } else {
        setGameResult('Split hands: ' + results.map((result, i) => `Hand ${i + 1} - ${result}`).join(', '));
      }
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

  const isCardHidden = (isDealer, cardIndex, gameState) => {
    return isDealer && cardIndex === 1 && (gameState === 'playing' || gameState === 'dealing');
  };

  const renderCard = (card, isDealer, index, isNewCard = false) => {
    return (
      <Card 
        className={`w-20 h-32 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-500 absolute
          ${isNewCard ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}
        style={{ 
          left: `${index * 40}px`, 
          zIndex: index
        }}
      >
        <CardContent className={`text-2xl ${isCardHidden(isDealer, index, gameStatus) ? 'bg-blue-800 w-full h-full flex items-center justify-center text-white' : ['♥', '♦'].includes(card.suit) ? 'text-red-500' : 'text-black'}`}>
          {isCardHidden(isDealer, index, gameStatus) ? '?' : card.value + card.suit}
        </CardContent>
      </Card>
    );
  };

  return (
    <main className="min-h-screen p-8 flex flex-col items-center">
      <h1 className="text-4xl mb-8">Blackjack</h1>
      
      {gameStatus === 'waiting' ? (
        <button
          onClick={startNewGame}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Start New Game
        </button>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="text-xl mb-2">Dealer's Hand ({calculateHandValue(dealerHand)})</h2>
            <div className="flex relative h-40 w-96 overflow-hidden mx-auto">
              {dealerHand.map((card, index) => (
                <div key={index}>
                  {renderCard(card, true, index, index === newCardIndex)}
                </div>
              ))}
            </div>
          </div>

          {playerHands.map((hand, handIndex) => (
            <div key={handIndex}>
              <h2 className="text-xl mb-2">
                Hand {handIndex + 1} ({calculateHandValue(hand)})
                {handIndex === currentHandIndex && gameStatus === 'playing' && " - Current Hand"}
              </h2>
              <div className="flex relative h-40 w-96 overflow-hidden">
                {hand.map((card, index) => (
                  <div key={index}>
                    {renderCard(card, false, index, index === newCardIndex)}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {gameStatus === 'playing' && (
            <div className="flex gap-4 flex-wrap justify-center">
              <button
                onClick={hit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Hit
              </button>
              <button
                onClick={stand}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Stand
              </button>
              {canDouble && (
                <button
                  onClick={double}
                  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                >
                  Double
                </button>
              )}
              {canSurrender && (
                <button
                  onClick={surrender}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Surrender
                </button>
              )}
              {canSplit(playerHands[currentHandIndex]) && (
                <button
                  onClick={split}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Split
                </button>
              )}
            </div>
          )}

          {gameStatus === 'ended' && (
            <>
              <div className="text-2xl mb-4">{gameResult}</div>
              <button
                onClick={startNewGame}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Play Again
              </button>
            </>
          )}
        </>
      )}
    </main>
  );
}