import { FIGHTER } from "../models/fighter.js";
import { HttpError } from "../helpers/HttpError.helper.js";

const isValidName = (name) => {
  if (!name) {
    throw HttpError({ status: 400, message: "Name is required" });
  }

  if (typeof name !== "string") {
    throw HttpError({ status: 400, message: "Name must be string" });
  }

  if (name.trim().length < 2) {
    throw HttpError({
      status: 400,
      message: "Name must consist at least 2 characters",
    });
  }
};

const isValidPower = (power) => {
  if (!power) {
    throw HttpError({ status: 400, message: "Power is required" });
  }

  if (typeof power !== "number") {
    throw HttpError({ status: 400, message: "Power must be a number" });
  }

  if (power < 1 || power > 100) {
    throw HttpError({ status: 400, message: "Power must be from 1 to 100" });
  }
};

const isValidDefense = (defense) => {
  if (!defense) {
    throw HttpError({ status: 400, message: "Defense is required" });
  }

  if (typeof defense !== "number") {
    throw HttpError({ status: 400, message: "Defense must be a number" });
  }

  if (defense < 1 || defense > 10) {
    throw HttpError({
      status: 400,
      message: "Defense must be from 1 to 10",
    });
  }
};

export const isValidHealth = (health) => {
  if (health === null || health === undefined) {
    return;
  }

  if (typeof health !== "number") {
    throw HttpError({ status: 400, message: "Health must be a number" });
  }

  if (health < 80 || health > 120) {
    throw HttpError({
      status: 400,
      message: "Health must be from 80 to 120",
    });
  }
};

const createFighterValid = (req, res, next) => {
  const { name, health, power, defense } = req.body;

  try {
    const fighterProperties = Object.keys(FIGHTER);
    const providedProperties = Object.keys(req.body);

    if (!providedProperties.length) {
      throw HttpError({
        status: 400,
        message: "Provide body with fighter data",
      });
    }

    providedProperties.forEach((prop) => {
      if (prop === "id") {
        throw HttpError({ status: 400, message: "You cannot provide id" });
      }

      if (!fighterProperties.includes(prop)) {
        throw HttpError({
          status: 400,
          message: `You cannot provide extra fields: ${prop}`,
        });
      }
    });

    isValidName(name);
    isValidHealth(health);
    isValidPower(power);
    isValidDefense(defense);

    if (!health) {
      req.body.health = 100;
    }

    next();
  } catch (error) {
    next(error);
  }
};

const updateFighterValid = (req, res, next) => {
  try {
    const { body } = req;
    const fighterProperties = Object.keys(FIGHTER);
    const providedProperties = Object.keys(req.body);

    if (!providedProperties.length) {
      throw HttpError({
        status: 400,
        message: "Provide body with fighter data",
      });
    }

    providedProperties.forEach((prop) => {
      if (prop === "id") {
        throw HttpError({ status: 400, message: "You cannot update id" });
      }

      if (!fighterProperties.includes(prop)) {
        throw HttpError({
          status: 400,
          message: `You cannot provide extra fields: ${prop}`,
        });
      }
    });

    providedProperties.forEach((prop) => {
      if (prop === "name") {
        isValidName(body[prop]);
      } else if (prop === "health") {
        isValidHealth(body[prop]);
      } else if (prop === "power") {
        isValidPower(body[prop]);
      } else if (prop === "defense") {
        isValidDefense(body[prop]);
      }
    });

    next();
  } catch (error) {
    next(error);
  }
};

export { createFighterValid, updateFighterValid };
