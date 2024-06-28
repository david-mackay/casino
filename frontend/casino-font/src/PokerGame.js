import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

function PokerGame({ balance, setBalance }) {
  const [gameState, setGameState] = useState(null);
  const [showPlayerCards, setShowPlayerCards] = useState(false);

  useEffect(() => {
    // Fetch initial game state when component mounts
    fetchGameState();
  }, []);

  const fetchGameState = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/game_state');
      setGameState(response.data);
    } catch (error) {
      console.error('Error fetching game state:', error);
    }
  };

  const newGame = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/new_game');
      setGameState(response.data);
      setBalance(response.data.balance);
      setShowPlayerCards(false);
    } catch (error) {
      console.error('Error starting new game:', error);
    }
  };

  const performAction = async (action, amount = null) => {
    try {
      const response = await axios.post('http://localhost:5000/api/action', { action, amount });
      setGameState(response.data);
      setBalance(response.data.balance);
    } catch (error) {
      console.error('Error performing action:', error);
    }
  };

  if (!gameState) return <div>Loading...</div>;

  return (
    <div>
      <Link to="/">Home</Link>
      <h1>Poker Game</h1>
      <button onClick={newGame}>New Game</button>
      <p>Balance: ${balance}</p>
      <p>Current Pot: ${gameState.current_pot}</p>

      <h2>Dealer</h2>
      <div className="cards-container">
        <ul>
          {gameState.dealer_cards.map((card, index) => (
            <li key={index}>
              {gameState.show_dealer_cards ? (
                <img src={`/cards/${card}.png`} alt={card} />
              ) : (
                <div className="hidden-card">Hidden</div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <h2>Board</h2>
      <div className="cards-container">
        <ul>
          {gameState.board_cards.map((card, index) => (
            <li key={index}>
              {card ? (
                <img src={`/cards/${card}.png`} alt={card} />
              ) : (
                <div className="hidden-card">Hidden</div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <h2>Player</h2>
      <button onClick={() => setShowPlayerCards(!showPlayerCards)}>
        Show/Hide Player Cards
      </button>
      <div className="cards-container">
        <ul>
          {gameState.player_cards.map((card, index) => (
            <li key={index}>
              {showPlayerCards ? (
                <img src={`/cards/${card}.png`} alt={card} />
              ) : (
                <div className="hidden-card">Hidden</div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <button onClick={() => performAction('pass')}>Pass</button>
      {gameState.can_bet_60 && (
        <button onClick={() => performAction('bet', 60)}>Bet 60</button>
      )}
      {gameState.can_bet_40 && (
        <button onClick={() => performAction('bet', 40)}>Bet 40</button>
      )}
      {gameState.can_bet_20 && (
        <button onClick={() => performAction('bet', 20)}>Bet 20</button>
      )}

      <pre>{gameState.result}</pre>
    </div>
  );
}

export default PokerGame;