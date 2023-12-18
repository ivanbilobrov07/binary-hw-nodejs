import { Router } from "express";
import { userService } from "../services/userService.js";
import { HttpError } from "../helpers/HttpError.helper.js";
import {
  createUserValid,
  updateUserValid,
} from "../middlewares/user.validation.middleware.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.helper.js";
import { responseMiddleware } from "../middlewares/response.middleware.js";

const router = Router();

const getUsers = (req, res, next) => {
  const allUsers = userService.getAll();
  res.data = allUsers;

  next();
};

const getUserById = (req, res, next) => {
  const { id } = req.params;
  const user = userService.search({ id });

  if (!user) {
    res.err = HttpError({ status: 404, message: "User not found" });
    next();
  }

  res.data = user;
  next();
};

const createUser = (req, res, next) => {
  if (userService.search({ email: req.body.email })) {
    res.err = HttpError({
      status: 400,
      message: "This email has already taken",
    });

    next();
  } else if (userService.search({ phoneNumber: req.body.phoneNumber })) {
    res.err = HttpError({
      status: 400,
      message: "This phone number has already taken",
    });

    next();
  }

  const createdUser = userService.create(req.body);
  res.data = createdUser;

  next();
};

const updateUser = (req, res, next) => {
  const { id } = req.params;
  const updatedUser = userService.update(id, req.body);

  if (!updateUser) {
    res.err = HttpError({ status: 404, message: "User not found" });
    next();
  }

  res.data = updatedUser;
  next();
};

const deleteUser = (req, res, next) => {
  const { id } = req.params;
  const user = userService.delete(id);

  if (!user) {
    res.err = HttpError({ status: 404, message: "User not found" });
    next();
  }

  res.data = user;
  next();
};

router.get("/", ctrlWrapper(getUsers), responseMiddleware);
router.get("/:id", ctrlWrapper(getUserById), responseMiddleware);
router.post("/", createUserValid, ctrlWrapper(createUser), responseMiddleware);
router.put(
  "/:id",
  updateUserValid,
  ctrlWrapper(updateUser),
  responseMiddleware
);
router.delete("/:id", ctrlWrapper(deleteUser), responseMiddleware);

export { router };
