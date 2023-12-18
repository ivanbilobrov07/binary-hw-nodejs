import React from "react";

import "./fightIndicator.css";

export const FighterIndicator = ({
  fighter,
  isCriticalAttackAvailable,
  curHealth,
  position,
}) => {
  return (
    <div className="arena___fighter-indicator">
      <span className="arena___fighter-name">{fighter.name}</span>
      <div className="arena___health-indicator">
        <div
          style={{
            width: `${Math.round((curHealth / fighter.health) * 100)}%`,
          }}
          className="arena___health-bar"
        ></div>
      </div>
      {!isCriticalAttackAvailable && (
        <p className={`fighter___critical-damage-label ${position}`}>
          Critical attack is not awailable at the moment
        </p>
      )}
    </div>
  );
};
