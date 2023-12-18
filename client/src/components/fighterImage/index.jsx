import React from "react";

import "./fighterImage.css";

export const FighterImage = ({ fighter, position }) => {
  return (
    <div className={`arena___fighter arena___${position}-fighter`}>
      <img
        className="fighter-preview___img"
        src="https://66.media.tumblr.com/tumblr_lq8g3548bC1qd0wh3o1_400.gif"
        alt={fighter.name}
      />
    </div>
  );
};
