import React, { useEffect, useMemo, useState } from "react";

import "./fightsHistory.css";
import { get } from "../../services/requestHelper";

const FightsHistory = ({ fights }) => {
  const [allFighters, setAllFighters] = useState(null);

  useEffect(() => {
    const getAllFighters = async () => {
      const data = await get("fighters");
      setAllFighters(data);
    };

    getAllFighters();
  }, [setAllFighters]);

  const sortedFights = useMemo(() => {
    return [...fights].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [fights]);

  return allFighters ? (
    <div>
      <h2 className="recent-matches___title">
        {sortedFights.length
          ? "Recent Matches"
          : "There are not any recent matches"}
      </h2>
      <ul className="recent-matches___list">
        {sortedFights.map(({ id, fighter1, fighter2, log }) => {
          const firstFighter = allFighters.find((f) => f.id === fighter1);
          const secondFighter = allFighters.find((f) => f.id === fighter2);

          const logData = log[0];
          const winner =
            logData.fighter1Health > 0 ? firstFighter : secondFighter;

          return (
            <li className="recent-matches___item" key={id}>
              <div className="match">
                <div>
                  <h3>{winner === firstFighter ? "Winner" : "Loser"}</h3>
                  <p>Name: {firstFighter.name}</p>
                  <p>Num of attacks: {logData.fighter1Shot}</p>
                  <p>Remaining health: {Math.round(logData.fighter1Health)}</p>
                </div>
                <div>
                  <h3>{winner === secondFighter ? "Winner" : "Loser"}</h3>
                  <p>Name: {secondFighter.name}</p>
                  <p>Num of attacks: {logData.fighter2Shot}</p>
                  <p>Remaining health: {Math.round(logData.fighter2Health)}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default FightsHistory;
