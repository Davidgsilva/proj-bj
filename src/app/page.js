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

export default function BlackjackGame() {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameStatus, setGameStatus] = useState('waiting'); // waiting, dealing, playing, dealer-turn, ended
  const [gameResult, setGameResult] = useState('');
  const [newCardIndex, setNewCardIndex] = useState(-1);

  const dealCards = async () => {
    const newDeck = shuffleDeck(createDeck());
    setDeck(newDeck);
    setGameStatus('dealing');
    
    // Deal cards one at a time with animation
    setNewCardIndex(0);
    setPlayerHand([newDeck[0]]);
    await new Promise(resolve => setTimeout(resolve, 500));
    setNewCardIndex(-1);
    
    setNewCardIndex(0);
    setDealerHand([newDeck[1]]);
    await new Promise(resolve => setTimeout(resolve, 500));
    setNewCardIndex(-1);
    
    setNewCardIndex(1);
    const playerInitialHand = [newDeck[0], newDeck[2]];
    setPlayerHand(playerInitialHand);
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
    }
  };

  const startNewGame = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setGameResult('');
    setNewCardIndex(-1);
    dealCards();
  };

  const hit = async () => {
    if (gameStatus !== 'playing') return;

    const newCard = deck[playerHand.length + dealerHand.length];
    setGameStatus('dealing');
    setNewCardIndex(playerHand.length);
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);
    await new Promise(resolve => setTimeout(resolve, 500));
    setNewCardIndex(-1);

    const newHandValue = calculateHandValue(newHand);
    if (newHandValue === 21) {
      setGameStatus('ended');
      setGameResult('21! You win!');
    } else if (newHandValue > 21) {
      setGameStatus('ended');
      setGameResult('Bust! Dealer wins!');
    } else {
      setGameStatus('playing');
    }
  };

  const stand = async () => {
    if (gameStatus !== 'playing') return;
    
    let currentDealerHand = [...dealerHand];
    let currentIndex = playerHand.length + dealerHand.length;
    
    while (calculateHandValue(currentDealerHand) < 17) {
      setGameStatus('dealing');
      setNewCardIndex(currentDealerHand.length);
      currentDealerHand = [...currentDealerHand, deck[currentIndex]];
      setDealerHand(currentDealerHand);
      await new Promise(resolve => setTimeout(resolve, 500));
      setNewCardIndex(-1);
      currentIndex++;
    }

    setGameStatus('ended');

    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(currentDealerHand);

    if (dealerValue > 21) {
      setGameResult('Dealer busts! You win!');
    } else if (dealerValue > playerValue) {
      setGameResult('Dealer wins!');
    } else if (dealerValue < playerValue) {
      setGameResult('You win!');
    } else {
      setGameResult('Push - it\'s a tie!');
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
            <div className="flex relative h-40 w-96 overflow-hidden">
              {dealerHand.map((card, index) => (
                <div key={index}>
                  {renderCard(card, true, index, index === newCardIndex)}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl mb-2">Your Hand ({calculateHandValue(playerHand)})</h2>
            <div className="flex relative h-40 w-96 overflow-hidden">
              {playerHand.map((card, index) => (
                <div key={index}>
                  {renderCard(card, false, index, index === newCardIndex)}
                </div>
              ))}
            </div>
          </div>

          {gameStatus === 'playing' && (
            <div className="flex gap-4">
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