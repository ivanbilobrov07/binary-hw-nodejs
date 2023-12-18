import React, { useEffect, useState } from "react";

import controls from "../../constants/controls";

import { FighterImage } from "../fighterImage";
import { FighterIndicator } from "../fighterIndicator";

import "./arena.css";

const POSITION = {
  LEFT: "left",
  RIGHT: "right",
};

const calculateRandomNumber = (from, to) => {
  return Math.random() * (to - from) + from;
};

const getCriticalAtackPower = (fighter) => {
  return fighter.power * 2;
};

export function getHitPower(fighter) {
  return fighter.power * calculateRandomNumber(1, 2);
}

export function getBlockPower(fighter) {
  return fighter.defense * calculateRandomNumber(1, 2);
}

export function getDamage(attacker, defender) {
  const hitPower = getHitPower(attacker);
  const blockPower = getBlockPower(defender);

  return hitPower > blockPower ? hitPower - blockPower : 0;
}

export const Arena = ({ firstFighter, secondFighter, onFinished }) => {
  const [endingFlag, setEndingFlag] = useState(true);
  const [firstFighterHealth, setFirstFighterHealth] = useState(
    () => firstFighter.health
  );
  const [secondFighterHealth, setSecondFighterHealth] = useState(
    () => secondFighter.health
  );
  const [isFirstCritAttackAvailable, setIsFirstCritAttackAvailable] =
    useState(true);
  const [isSecondCritAttackAvailable, setIsSecondCritAttackAvailable] =
    useState(true);
  const [firstFighterAttacks, setFirstFighterAttacks] = useState(0);
  const [secondFighterAttacks, setSecondFighterAttacks] = useState(0);

  useEffect(() => {
    const performCriticalAttack = (fighter) => {
      const setIsCritAttackAvailable =
        fighter === firstFighter
          ? setIsFirstCritAttackAvailable
          : setIsSecondCritAttackAvailable;

      setIsCritAttackAvailable(false);

      setTimeout(() => {
        setIsCritAttackAvailable(true);
      }, 10000);
    };

    const firstPlayerAttack = () => {
      setFirstFighterAttacks((s) => s + 1);
      setSecondFighterHealth((s) => s - getDamage(firstFighter, secondFighter));
    };

    const secondPlayerAttack = () => {
      setSecondFighterAttacks((s) => s + 1);
      setFirstFighterHealth((s) => s - getDamage(secondFighter, firstFighter));
    };

    const firstPlayerCritAttack = () => {
      setFirstFighterAttacks((s) => s + 1);
      setSecondFighterHealth((s) => s - getCriticalAtackPower(firstFighter));
      performCriticalAttack(firstFighter);
    };

    const secondPlayerCritAttack = () => {
      setSecondFighterAttacks((s) => s + 1);
      setFirstFighterHealth((s) => s - getCriticalAtackPower(secondFighter));
      performCriticalAttack(secondFighter);
    };

    const pressedKeys = new Set();

    const windowKeyupHandler = ({ code }) => {
      if (
        code === controls.PlayerOneAttack &&
        !pressedKeys.has(controls.PlayerOneBlock) &&
        !pressedKeys.has(controls.PlayerTwoBlock)
      ) {
        firstPlayerAttack();
      } else if (
        code === controls.PlayerTwoAttack &&
        !pressedKeys.has(controls.PlayerOneBlock) &&
        !pressedKeys.has(controls.PlayerTwoBlock)
      ) {
        secondPlayerAttack();
      } else {
        const isCriticalAttackByFirstPlayer =
          controls.PlayerOneCriticalHitCombination.reduce((acc, cur) => {
            if (!pressedKeys.has(cur)) {
              return false;
            }

            return acc;
          }, true);
        const isCriticalAttackBySecondPlayer =
          controls.PlayerTwoCriticalHitCombination.reduce((acc, cur) => {
            if (!pressedKeys.has(cur)) {
              return false;
            }

            return acc;
          }, true);

        if (
          isCriticalAttackByFirstPlayer &&
          isFirstCritAttackAvailable &&
          !pressedKeys.has(controls.PlayerOneBlock)
        ) {
          firstPlayerCritAttack();
        }
        if (
          isCriticalAttackBySecondPlayer &&
          isSecondCritAttackAvailable &&
          !pressedKeys.has(controls.PlayerTwoBlock)
        ) {
          secondPlayerCritAttack();
        }
      }

      pressedKeys.delete(code);
    };

    const windowKeydownHandler = ({ code }) => {
      pressedKeys.add(code);
    };

    window.addEventListener("keyup", windowKeyupHandler);
    window.addEventListener("keydown", windowKeydownHandler);

    return () => {
      window.removeEventListener("keyup", windowKeyupHandler);
      window.removeEventListener("keydown", windowKeydownHandler);
    };
  }, [
    firstFighter,
    secondFighter,
    isFirstCritAttackAvailable,
    isSecondCritAttackAvailable,
  ]);

  useEffect(() => {
    if (!endingFlag) {
      return;
    }

    if (firstFighterHealth <= 0 || secondFighterHealth <= 0) {
      const data = {
        fighter1: firstFighter.id,
        fighter2: secondFighter.id,
        log: [
          {
            fighter1Shot: firstFighterAttacks,
            fighter2Shot: secondFighterAttacks,
            fighter1Health: firstFighterHealth < 0 ? 0 : firstFighterHealth,
            fighter2Health: secondFighterHealth < 0 ? 0 : secondFighterHealth,
          },
        ],
      };
      onFinished(data);
      setEndingFlag(false);
    }
  }, [
    firstFighterHealth,
    secondFighterHealth,
    firstFighter,
    secondFighter,
    onFinished,
    firstFighterAttacks,
    secondFighterAttacks,
    endingFlag,
    setEndingFlag,
  ]);

  return (
    <div className="arena___root">
      <div className="arena___fight-status">
        <FighterIndicator
          fighter={firstFighter}
          curHealth={firstFighterHealth}
          position={POSITION.LEFT}
          isCriticalAttackAvailable={isFirstCritAttackAvailable}
        />
        <div className="arena___versus-sign"></div>
        <FighterIndicator
          fighter={secondFighter}
          curHealth={secondFighterHealth}
          position={POSITION.RIGHT}
          isCriticalAttackAvailable={isSecondCritAttackAvailable}
        />
      </div>
      <div className="arena___battlefield">
        <FighterImage fighter={firstFighter} position={POSITION.LEFT} />
        <FighterImage fighter={secondFighter} position={POSITION.RIGHT} />
      </div>
    </div>
  );
};
