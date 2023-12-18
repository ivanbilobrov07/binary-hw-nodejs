import { Router } from "express";
import { fightersService } from "../services/fightService.js";
import { createFightValid } from "../middlewares/fight.validation.middleware.js";
import { responseMiddleware } from "../middlewares/response.middleware.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.helper.js";

const router = Router();

const getFights = (req, res, next) => {
  const allFights = fightersService.getAll();
  res.data = allFights;

  next();
};

const createFight = (req, res, next) => {
  const createdFight = fightersService.create(req.body);
  res.data = createdFight;

  next();
};

router.get("/", ctrlWrapper(getFights), responseMiddleware);

router.post(
  "/",
  createFightValid,
  ctrlWrapper(createFight),
  responseMiddleware
);

export { router };
