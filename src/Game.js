// Game.js
import React, { useState, useEffect } from 'react';
import { data } from './data';
import { getColorForClass, getColorForRank, getRandomPlayers } from './utils';

function Game() {
  const correctPlayers = ["Kónan", "Maudado", "Herrenlos"];
  const [inputValue, setInputValue] = useState('');
  const [revealedPlayers, setRevealedPlayers] = useState([]);
  const [correctRevealedPlayers, setCorrectRevealedPlayers] = useState([]); // Track revealed correct players
  const [guessCounter, setGuessCounter] = useState(0);
  const [highlightedCorrectPlayers, setHighlightedCorrectPlayers] = useState([]); // Tracks which correct player boxes are highlighted
  const [suggestedPlayers, setSuggestedPlayers] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');

  // Add state for lives and players found counters
  const [livesRemaining, setLivesRemaining] = useState(6); // Starts at 6
  const [playersFound, setPlayersFound] = useState(0); // Starts at 0

  const maxGuesses = 6;

  useEffect(() => {
    // Check if the player has revealed all 3 correct players
    if (correctRevealedPlayers.length === 3) {
      setGameOver(true);
      setMessage('Alle drei Spieler gefunden, du bist ein Boss!');
    } else if (guessCounter >= maxGuesses) {
      setGameOver(true);
      if (correctRevealedPlayers.length === 0) {
        setMessage('Kein einzigen gefunden...? Das krass.');
      } else {
        setMessage(`Nicht ganz! Du hast ${correctRevealedPlayers.length} von 3 Spielern gefunden!`);
      }
    }
  }, [correctRevealedPlayers, guessCounter]);

  useEffect(() => {
    // Handle highlighting of correct players after wrong guesses 3, 4, and 5
    if (guessCounter >= 3 && guessCounter <= 5) {
      const remainingCorrect = correctPlayers.filter(player => !highlightedCorrectPlayers.includes(player));
      if (remainingCorrect.length > 0) {
        const playerToHighlight = remainingCorrect[0]; // Highlight the first unhighlighted correct player
        setHighlightedCorrectPlayers([...highlightedCorrectPlayers, playerToHighlight]);
      }
    }
  }, [guessCounter]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.length > 0) {
      const suggestions = data.players
        .map((player) => player.name)
        .filter((name) => name.toLowerCase().startsWith(value.toLowerCase()) && !revealedPlayers.includes(name));
      setSuggestedPlayers(suggestions);
    } else {
      setSuggestedPlayers([]);
    }
  };

  const handlePlayerGuess = (e) => {
    if (e.key === 'Enter' && suggestedPlayers.includes(inputValue) && !gameOver) {
      const guessedPlayer = data.players.find((p) => p.name === inputValue);

      if (correctPlayers.includes(guessedPlayer.name)) {
        // Add to revealed players and correct players
        setRevealedPlayers([...revealedPlayers, guessedPlayer.name]);
        setCorrectRevealedPlayers([...correctRevealedPlayers, guessedPlayer.name]);
        setPlayersFound(playersFound + 1); // Increment players found counter
      } else {
        setGuessCounter(guessCounter + 1);
        setLivesRemaining(livesRemaining - 1); // Decrement lives remaining counter
        revealRandomPlayers(guessedPlayer.name);
      }

      setInputValue('');
      setSuggestedPlayers([]);
    }
  };

  const revealRandomPlayers = (guessedPlayerName) => {
    let hiddenPlayers = data.players.filter(
      (p) => !revealedPlayers.includes(p.name) && p.name !== guessedPlayerName && !correctPlayers.includes(p.name)
    );
    let randomPlayers = getRandomPlayers(hiddenPlayers, Math.min(3, hiddenPlayers.length)); // Reveal 3 random players

    setRevealedPlayers([...revealedPlayers, guessedPlayerName, ...randomPlayers.map((p) => p.name)]);
  };

  const isCorrectPlayer = (playerName) => correctPlayers.includes(playerName);

  return (
    <div className="game">
      <header><strong>LOGDLE</strong></header>

      {/* Counters for lives remaining and players found */}
      <div className="counters">
        <span><strong>Lives Remaining:</strong> {livesRemaining}</span>
        <span><strong>Players Found:</strong> {playersFound} / 3</span>
      </div>

      <h1>{guessCounter >= 1 && data.raid}</h1>
      <h2>{guessCounter >= 2 && data.difficulty}</h2>
      <h3>{guessCounter >= 3 && data.bossFight}</h3>

      {/* Input Box */}
      {!gameOver && (
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handlePlayerGuess}
          placeholder="Guess a player name"
          list="suggested-players"
        />
      )}
      <datalist id="suggested-players">
        {suggestedPlayers.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>

      {/* DPS Table */}
      <h4>DPS Players</h4>
      <div className="table">
        {data.players
          .filter((p) => p.role === 'dps')
          .map((player, index) => (
            <div className="player-row" key={player.name}>
              <span className="player-number">{index + 1}.</span>
              {revealedPlayers.includes(player.name) ? (
                <>
                  <span style={{ color: getColorForClass(player.class) }}>{player.name}</span>
                  <span style={{ color: getColorForRank(player.rank) }}>{player.dps}</span>
                </>
              ) : highlightedCorrectPlayers.includes(player.name) ? (
                // Highlight the correct player's box without revealing their info
                <>
                  <span className="placeholder" style={{ backgroundColor: getColorForClass(player.class) }}>???</span>
                  <span className="placeholder" style={{ backgroundColor: getColorForClass(player.class) }}>???</span>
                </>
              ) : (
                // If this is a correct player, give it a special border
                <>
                  <span
                    className={isCorrectPlayer(player.name) ? 'correct-player-placeholder' : 'placeholder'}
                  >
                    ???
                  </span>
                  <span
                    className={isCorrectPlayer(player.name) ? 'correct-player-placeholder' : 'placeholder'}
                  >
                    ???
                  </span>
                </>
              )}
            </div>
          ))}
      </div>

      {/* Tank Table */}
      <h4>Tank Players</h4>
      <div className="table">
        {data.players
          .filter((p) => p.role === 'tank')
          .map((player, index) => (
            <div className="player-row" key={player.name}>
              <span className="player-number">{index + 1}.</span>
              {revealedPlayers.includes(player.name) ? (
                <>
                  <span style={{ color: getColorForClass(player.class) }}>{player.name}</span>
                  <span style={{ color: getColorForRank(player.rank) }}>{player.dps}</span>
                </>
              ) : highlightedCorrectPlayers.includes(player.name) ? (
                <>
                  <span className="placeholder" style={{ backgroundColor: getColorForClass(player.class) }}>???</span>
                  <span className="placeholder" style={{ backgroundColor: getColorForClass(player.class) }}>???</span>
                </>
              ) : (
                <>
                  <span
                    className={isCorrectPlayer(player.name) ? 'correct-player-placeholder' : 'placeholder'}
                  >
                    ???
                  </span>
                  <span
                    className={isCorrectPlayer(player.name) ? 'correct-player-placeholder' : 'placeholder'}
                  >
                    ???
                  </span>
                </>
              )}
            </div>
          ))}
      </div>

      {/* Healer Table */}
      <h4>Healer Players (HPS)</h4>
      <div className="table">
        {data.players
          .filter((p) => p.role === 'heal')
          .map((player, index) => (
            <div className="player-row" key={player.name}>
              <span className="player-number">{index + 1}.</span>
              {revealedPlayers.includes(player.name) ? (
                <>
                  <span style={{ color: getColorForClass(player.class) }}>{player.name}</span>
                  <span style={{ color: getColorForRank(player.rank) }}>{player.dps}</span>
                </>
              ) : highlightedCorrectPlayers.includes(player.name) ? (
                <>
                  <span className="placeholder" style={{ backgroundColor: getColorForClass(player.class) }}>???</span>
                  <span className="placeholder" style={{ backgroundColor: getColorForClass(player.class) }}>???</span>
                </>
              ) : (
                <>
                  <span
                    className={isCorrectPlayer(player.name) ? 'correct-player-placeholder' : 'placeholder'}
                  >
                    ???
                  </span>
                  <span
                    className={isCorrectPlayer(player.name) ? 'correct-player-placeholder' : 'placeholder'}
                  >
                    ???
                  </span>
                </>
              )}
            </div>
          ))}
      </div>

      {/* Win/Loss Message */}
      {gameOver && <div className="message">{message}</div>}
    </div>
  );
}

export default Game;
