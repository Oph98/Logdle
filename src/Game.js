import React from "react";
import { useDrag } from "react-dnd";
import "./Game.css";
import RankBox from "./RankBox";

function Player({ player }) {
  const [{ isDragging }, drag] = useDrag({
    type: "PLAYER",
    item: { player },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} className={`player-item ${isDragging ? "dragging" : ""}`}>
      <span style={{ color: player.classColor }}>{player.name}</span>
    </div>
  );
}

function Game({ remainingPlayers, currentTable, setCurrentTable, setRemainingPlayers }) {
  const dpsTable = currentTable.dps || Array(8).fill(null);
  const tankTable = currentTable.tank || Array(2).fill(null);
  const healerTable = currentTable.healer || Array(3).fill(null);

  return (
    <div className="game-container">
      <div className="remaining-players">
        <h3>Remaining Players</h3>
        {remainingPlayers.map((player) => (
          <Player key={player.id} player={player} />
        ))}
      </div>

      <div className="table">
        <div className="dps-table">
          <h3>DPS</h3>
          {dpsTable.map((_, index) => (
            <RankBox
              key={index}
              role="dps"
              index={index}
              currentTable={currentTable}
              setCurrentTable={setCurrentTable}
              setRemainingPlayers={setRemainingPlayers}
              remainingPlayers={remainingPlayers}
            />
          ))}
        </div>

        <div className="tanks-table">
          <h3>Tanks</h3>
          {tankTable.map((_, index) => (
            <RankBox
              key={index}
              role="tank"
              index={index}
              currentTable={currentTable}
              setCurrentTable={setCurrentTable}
              setRemainingPlayers={setRemainingPlayers}
              remainingPlayers={remainingPlayers}
            />
          ))}
        </div>

        <div className="heals-table">
          <h3>Heals</h3>
          {healerTable.map((_, index) => (
            <RankBox
              key={index}
              role="healer"
              index={index}
              currentTable={currentTable}
              setCurrentTable={setCurrentTable}
              setRemainingPlayers={setRemainingPlayers}
              remainingPlayers={remainingPlayers}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Game;
