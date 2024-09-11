import React from "react";
import { useDrop } from "react-dnd";
import "./Game.css";
import { players } from "./data";

function RankBox({ role, index, currentTable, setCurrentTable, setRemainingPlayers, remainingPlayers }) {
  const [{ isOver }, drop] = useDrop({
    accept: "PLAYER",
    drop: (item) => {
      // Remove player from the remaining players when they are dropped into the rank box
      setRemainingPlayers((prevPlayers) => prevPlayers.filter(p => p.id !== item.player.id));

      // Update the current table with the player in the right role and index
      setCurrentTable((prevTable) => {
        const newTable = { ...prevTable };
        if (!newTable[role]) {
          newTable[role] = [];
        }
        newTable[role][index] = item.player;
        return newTable;
      });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Get the correct DPS for this rank and role
  const correctPlayer = players.find(
    (p) => p.role === role && p.rank === index + 1
  );
  const correctDpsNumber = correctPlayer ? correctPlayer.dps : "-";
  const rankColor = correctPlayer ? correctPlayer.rankColor : "transparent";

  // Display the currently dragged-in player (if any)
  const player = currentTable[role] ? currentTable[role][index] : null;

  return (
    <div className="rank-container">
      <div className={`rank-box ${isOver ? "hover" : ""}`} ref={drop}>
        {player ? (
          <div className="player-info">
            <span style={{ color: player.classColor }} className="name">
              {player.name}
            </span>
          </div>
        ) : (
          <div className="rank">{index + 1}</div>
        )}
      </div>

      <div className="dps-number" style={{ color: rankColor }}>
        {correctDpsNumber}
      </div>
    </div>
  );
}

export default RankBox;
