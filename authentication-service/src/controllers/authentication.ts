import { NextFunction, Request, Response } from "express";
import { asyncWrapper, HTTPError } from "@marius98/myzone-common-package";
import {
  isEmailValid,
  isMinimumLengthValidationCompleted,
  isRequiredValidationCompleted,
} from "./utils";
import { SignupRequestBody } from "./types";
import User from "../models/User";

export const login = asyncWrapper(
  (req: Request, res: Response, next: NextFunction) => {}
);

export const handleSignupValidation = (
  requestBody: SignupRequestBody,
  next: NextFunction
) => {
  const { name, email, lastName, password, passwordConfirm } = requestBody;

  if (
    !isRequiredValidationCompleted(name) ||
    !isRequiredValidationCompleted(lastName)
  )
    return next(new HTTPError("Name and LastName must not be empty!", 400));

  if (
    !isMinimumLengthValidationCompleted(password, 6) ||
    !isMinimumLengthValidationCompleted(passwordConfirm, 6)
  )
    return next(
      new HTTPError(
        "Password and Password confirmation must be greater than 6 characters!",
        400
      )
    );

  if (!isEmailValid(email))
    return next(new HTTPError("Email is not valid!", 400));

  return true;
};

export const signup = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, lastName, email, password, passwordConfirm } = req.body;

    if (
      handleSignupValidation(
        { name, lastName, email, password, passwordConfirm },
        next
      )
    ) {
      const newUser = User.build({
        name,
        lastName,
        email,
        password,
        passwordConfirm,
      });

      // await newUser.save();
    }
  }
);
