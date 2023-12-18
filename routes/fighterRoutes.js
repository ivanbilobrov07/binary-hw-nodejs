import { Router } from "express";
import { fighterService } from "../services/fighterService.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.helper.js";
import { HttpError } from "../helpers/HttpError.helper.js";
import { responseMiddleware } from "../middlewares/response.middleware.js";
import {
  createFighterValid,
  updateFighterValid,
} from "../middlewares/fighter.validation.middleware.js";

const router = Router();

const getFighters = (req, res, next) => {
  const allFighters = fighterService.getAll();
  res.data = allFighters;

  next();
};

const getFighterById = (req, res, next) => {
  const { id } = req.params;
  const fighter = fighterService.search({ id });

  if (!fighter) {
    res.err = HttpError({ status: 404, message: "Fighter not found" });
    next();
  }

  res.data = fighter;
  next();
};

const createFighter = (req, res, next) => {
  if (fighterService.search({ name: req.body.name })) {
    res.err = HttpError({
      status: 400,
      message: "This name has already taken",
    });

    next();
  }

  const createdFighter = fighterService.create(req.body);
  res.data = createdFighter;

  next();
};

const updateFighter = (req, res, next) => {
  const { id } = req.params;
  const updatedFighter = fighterService.update(id, req.body);

  if (!updatedFighter) {
    res.err = HttpError({ status: 404, message: "Fighter not found" });
    next();
  }

  res.data = updatedFighter;
  next();
};

const deleteFighter = (req, res, next) => {
  const { id } = req.params;
  const fighter = fighterService.delete(id);

  if (!fighter) {
    res.err = HttpError({ status: 404, message: "Fighter not found" });
    next();
  }

  res.data = fighter;
  next();
};

router.get("/", ctrlWrapper(getFighters), responseMiddleware);
router.get("/:id", ctrlWrapper(getFighterById), responseMiddleware);
router.post(
  "/",
  createFighterValid,
  ctrlWrapper(createFighter),
  responseMiddleware
);
router.put(
  "/:id",
  updateFighterValid,
  ctrlWrapper(updateFighter),
  responseMiddleware
);
router.delete("/:id", ctrlWrapper(deleteFighter), responseMiddleware);

export { router };
