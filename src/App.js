import React, { useState } from "react";
import "./App.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { players } from "./data";
import Game from "./Game";

// Fisher-Yates shuffle to randomize array
function shuffleArray(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

function App() {
  const initialCurrentTable = {
    dps: Array(9).fill(null),
    tank: Array(2).fill(null),
    healer: Array(3).fill(null),
  };

  const [remainingPlayers, setRemainingPlayers] = useState(shuffleArray(players)); // Randomize player order
  const [currentTable, setCurrentTable] = useState(initialCurrentTable);
  const [attempts, setAttempts] = useState(0);
  const [correctPairs, setCorrectPairs] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const allBoxesFilled = () => {
    return (
      currentTable.dps.every((slot) => slot !== null) &&
      currentTable.tank.every((slot) => slot !== null) &&
      currentTable.healer.every((slot) => slot !== null)
    );
  };

  const handleSubmit = () => {
    if (!allBoxesFilled()) {
      setErrorMessage("All boxes need to be filled before submitting.");
      return;
    }

    let newTable = { ...currentTable };
    let newRemainingPlayers = [...remainingPlayers];
    let newCorrectPairs = [...correctPairs];

    for (let role in currentTable) {
      newTable[role] = currentTable[role].map((player, index) => {
        const correctPlayer = players.find(
          (p) => p.role === role && p.rank === index + 1
        );

        if (player && player.id === correctPlayer.id) {
          newCorrectPairs.push(correctPlayer.id);
          return player;
        } else {
          // Re-add incorrect players back to the remaining players list
          if (player) newRemainingPlayers.push(player);
          return null;
        }
      });
    }

    setCurrentTable(newTable);
    setRemainingPlayers(newRemainingPlayers);
    setCorrectPairs(newCorrectPairs);
    setAttempts(attempts + 1);
    setErrorMessage(""); // Clear the error message on successful submit
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-container">
        <header className="header">
          <h1>LOGDLE</h1>
          <h1>VotI | The Primal Council | Normal</h1>
        </header>
        <div className="game-container">
          <Game
            remainingPlayers={remainingPlayers}
            currentTable={currentTable}
            setCurrentTable={setCurrentTable}
            setRemainingPlayers={setRemainingPlayers}
          />
          <button className="submit" onClick={handleSubmit}>Submit</button>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <p>Attempts: {attempts}</p>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
