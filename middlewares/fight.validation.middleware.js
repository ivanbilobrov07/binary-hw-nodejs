import { HttpError } from "../helpers/HttpError.helper.js";
import { fighterService } from "../services/fighterService.js";
import { FIGHT } from "../models/fight.js";

const isValidHealth = (health) => {
  if (health === null || health === undefined) {
    throw HttpError({ status: 400, message: "Health is a required field" });
  }

  if (typeof health !== "number") {
    throw HttpError({ status: 400, message: "Health must be a number" });
  }

  if (health < 0 || health > 120) {
    throw HttpError({
      status: 400,
      message: "Health must be from 0 to 120",
    });
  }
};

const isValidFighterId = (id) => {
  if (!id) {
    throw HttpError({ status: 400, message: "Fighters ids are required" });
  }

  if (typeof id !== "string") {
    throw HttpError({
      status: 400,
      message: "Fighter id must be of type string",
    });
  }

  if (!fighterService.search({ id })) {
    throw HttpError({
      status: 404,
      message: `Cannot find fighter with id: ${id}`,
    });
  }
};

export const isValidNumberOfShots = (num) => {
  if (num === null || num === undefined) {
    throw HttpError({
      status: 400,
      message: "Number of shots of fighter is required",
    });
  }

  if (typeof num !== "number") {
    throw HttpError({
      status: 400,
      message: "Number of shots must be of type number",
    });
  }

  if (num < 0) {
    throw HttpError({
      status: 400,
      message: "Number of shots cant be less than 0",
    });
  }
};

const isValidLog = (log) => {
  if (!log) {
    throw HttpError({ status: 400, message: "Fight log is required" });
  }

  if (!Array.isArray(log)) {
    throw HttpError({ status: 400, message: "log must be of type array" });
  }

  if (log.length !== 1) {
    throw HttpError({
      status: 400,
      message: "log must contain only 1 item",
    });
  }

  const logInfo = log[0];

  if (typeof logInfo !== "object") {
    throw HttpError({
      status: 400,
      message: "log must contains only an object",
    });
  }

  const { fighter1Shot, fighter2Shot, fighter1Health, fighter2Health } =
    logInfo;

  isValidNumberOfShots(fighter1Shot);
  isValidNumberOfShots(fighter2Shot);
  isValidHealth(fighter1Health);
  isValidHealth(fighter2Health);
};

const createFightValid = (req, res, next) => {
  const { fighter1, fighter2, log } = req.body;

  try {
    const fightProperties = Object.keys(FIGHT);
    const providedProperties = Object.keys(req.body);

    if (!providedProperties.length) {
      throw HttpError({ status: 400, message: "Provide body with fight data" });
    }

    providedProperties.forEach((prop) => {
      if (prop === "id") {
        throw HttpError({ status: 400, message: "You cannot provide id" });
      }

      if (!fightProperties.includes(prop)) {
        throw HttpError({
          status: 400,
          message: `You cannot provide extra fields: ${prop}`,
        });
      }
    });

    isValidFighterId(fighter1);
    isValidFighterId(fighter2);
    isValidLog(log);

    next();
  } catch (error) {
    next(error);
  }
};

export { createFightValid };
