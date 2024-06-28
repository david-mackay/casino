import React, { useState, useEffect } from 'react';

function HigherLower() {
  const [playerCard, setPlayerCard] = useState(null);
  const [dealerCard, setDealerCard] = useState(null);
  const [bet, setBet] = useState(10);
  const [balance, setBalance] = useState(100);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState(null);

  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
  const suits = ['s', 'c', 'h', 'd'];

  const getCard = () => {
    const rank = ranks[Math.floor(Math.random() * ranks.length)];
    const suit = suits[Math.floor(Math.random() * suits.length)];
    return { rank, suit, filename: `${rank}${suit}.png` };
  };

  const startGame = () => {
    setGameStarted(true);
    setPlayerCard(getCard());
    setDealerCard(getCard());
  };

  const placeBet = (amount) => {
    setBet(bet + amount);
  };

  const makeChoice = (choice) => {
    const playerRankIndex = ranks.indexOf(playerCard.rank);
    const dealerRankIndex = ranks.indexOf(dealerCard.rank);
    if (playerRankIndex === dealerRankIndex) {
      setResult('Push');
      setBalance(balance + bet);
    } else if ((choice === 'higher' && dealerRankIndex > playerRankIndex) || (choice === 'lower' && dealerRankIndex < playerRankIndex)) {
      setResult('Win');
      setBalance(balance + bet * 2);
    } else {
      setResult('Loss');
    }
    setGameOver(true);
  };

  useEffect(() => {
    if (gameOver) {
      setBet(10);
      setGameStarted(false);
      setGameOver(false);
    }
  }, [gameOver]);

  return (
    <div>
      <h1>Higher or Lower</h1>
      {gameStarted ? (
        <div>
          <h2>Player Card:</h2>
          <img src={`/cards/${playerCard.filename}`} alt={playerCard.filename} />
          <h2>Dealer Card:</h2>
          {gameOver ? (
            <img src={`/cards/${dealerCard.filename}`} alt={dealerCard.filename} />
          ) : (
            <img src="/cards/back.png" alt="Card back" />
          )}
          <p>Bet: ${bet}</p>
          <p>Balance: ${balance}</p>
          {gameOver ? (
            <div>
              <p>Result: {result}</p>
              <button onClick={() => setGameOver(false)}>Play Again</button>
            </div>
          ) : (
            <div>
              <button onClick={() => placeBet(5)}>Increase Bet by $5</button>
              <button onClick={() => makeChoice('higher')}>Higher</button>
              <button onClick={() => makeChoice('lower')}>Lower</button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p>Balance: ${balance}</p>
          <button onClick={startGame}>Start Game with bet $10</button>
        </div>
      )}
    </div>
  );
}

export default HigherLower;