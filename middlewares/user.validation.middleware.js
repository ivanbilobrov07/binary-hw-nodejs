import { USER } from "../models/user.js";
import { HttpError } from "../helpers/HttpError.helper.js";

const isValidFirstName = (firstName) => {
  if (!firstName) {
    throw HttpError({ status: 400, message: "Firstname is required" });
  }

  if (typeof firstName !== "string") {
    throw HttpError({ status: 400, message: "Firstname must be string" });
  }

  if (firstName.trim().length < 2) {
    throw HttpError({
      status: 400,
      message: "Firstname must consist at least 2 characters",
    });
  }
};

const isValidLastName = (lastName) => {
  if (!lastName) {
    throw HttpError({ status: 400, message: "Lastname is required" });
  }

  if (typeof lastName !== "string") {
    throw HttpError({ status: 400, message: "Lastname must be string" });
  }

  if (lastName.trim().length < 2) {
    throw HttpError({
      status: 400,
      message: "Lastname must consist at least 2 characters",
    });
  }
};

const isValidEmail = (email) => {
  if (!email) {
    throw HttpError({ status: 400, message: "Email is required" });
  }

  if (typeof email !== "string") {
    throw HttpError({ status: 400, message: "Email must be string" });
  }

  if (!email.endsWith("@gmail.com")) {
    throw HttpError({
      status: 400,
      message: "Email must ends with @gmail.com",
    });
  }

  if (email.trim().length < 12) {
    throw HttpError({
      status: 400,
      message: "Email must consist at least 12 characters",
    });
  }
};

const isValidPhoneNumber = (phoneNumber) => {
  const phoneRegExp = /^\+380\d{9}$/;

  if (!phoneNumber) {
    throw HttpError({ status: 400, message: "Phone number is required" });
  }

  if (typeof phoneNumber !== "string") {
    throw HttpError({ status: 400, message: "Phone number must be string" });
  }

  if (!phoneNumber.startsWith("+380")) {
    throw HttpError({
      status: 400,
      message: "Phone number must starts with +380",
    });
  }

  if (phoneNumber.trim().length !== 13) {
    throw HttpError({
      status: 400,
      message: "Phone number length must be 13 characters",
    });
  }

  if (!phoneRegExp.test(phoneNumber)) {
    throw HttpError({
      status: 400,
      message: "Phone number must contain only digits after +",
    });
  }
};

const isValidPassword = (password) => {
  if (!password) {
    throw HttpError({ status: 400, message: "Password is required" });
  }

  if (typeof password !== "string") {
    throw HttpError({ status: 400, message: "Password must be string" });
  }

  if (password.trim().length < 3) {
    throw HttpError({
      status: 400,
      message: "Password must consist at least 3 characters",
    });
  }
};

const createUserValid = (req, res, next) => {
  const { firstName, lastName, email, phoneNumber, password } = req.body;

  try {
    const userProperties = Object.keys(USER);
    const providedProperties = Object.keys(req.body);

    if (!providedProperties.length) {
      throw HttpError({ status: 400, message: "Provide body with user data" });
    }

    providedProperties.forEach((prop) => {
      if (prop === "id") {
        throw HttpError({ status: 400, message: "You cannot provide id" });
      }

      if (!userProperties.includes(prop)) {
        throw HttpError({
          status: 400,
          message: `You cannot provide extra fields: ${prop}`,
        });
      }
    });

    isValidFirstName(firstName);
    isValidLastName(lastName);
    isValidEmail(email);
    isValidPhoneNumber(phoneNumber);
    isValidPassword(password);

    next();
  } catch (error) {
    next(error);
  }
};

const updateUserValid = (req, res, next) => {
  try {
    const { body } = req;
    const userProperties = Object.keys(USER);
    const providedProperties = Object.keys(body);

    if (!providedProperties.length) {
      throw HttpError({ status: 400, message: "Provide body with user data" });
    }

    providedProperties.forEach((prop) => {
      if (prop === "id") {
        throw HttpError({ status: 400, message: "You cannot update id" });
      }

      if (!userProperties.includes(prop)) {
        throw HttpError({
          status: 400,
          message: `You cannot provide extra fields: ${prop}`,
        });
      }
    });

    providedProperties.forEach((prop) => {
      if (prop === "firstName") {
        isValidFirstName(body[prop]);
      } else if (prop === "lastName") {
        isValidLastName(body[prop]);
      } else if (prop === "email") {
        isValidEmail(body[prop]);
      } else if (prop === "phoneNumber") {
        isValidPhoneNumber(body[prop]);
      } else if (prop === "password") {
        isValidPassword(body[prop]);
      }
    });

    next();
  } catch (error) {
    next(error);
  }
};

export { createUserValid, updateUserValid };
