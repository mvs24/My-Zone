import { NextFunction, Request, Response } from "express";
import { asyncWrapper, HTTPError } from "@marius98/myzone-common-package";
import {
  isEmailValid,
  isMinimumLengthValidationCompleted,
  isRequiredValidationCompleted,
} from "./utils";
import { IUser, SignupRequestBody } from "./types";
import User from "../models/User";
import jwt from "jsonwebtoken";

// UTILITY FUNCTIONS

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

  if (password !== passwordConfirm)
    return next(
      new HTTPError("Password and password confirm are not equal!", 400)
    );

  if (!isEmailValid(email))
    return next(new HTTPError("Email is not valid!", 400));

  return true;
};

const getSignedToken = (payload: IUser) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!);

  return token;
};

const handleUserExistanceValidation = async (
  email: string,
  next: NextFunction
) => {
  const existingUser = await User.findOne({ email });

  if (existingUser)
    return next(new HTTPError("User with this email already exists!", 400));

  return true;
};

// ROUTE HANDLERS

export const login = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return next(
        new HTTPError("User with the provided email does not exists!", 404)
      );

    if (!(await existingUser.isPasswordCorrect(password)))
      return next(
        new HTTPError(
          "User with the provided email and password does not exists!",
          404
        )
      );

    const userPayload: IUser = {
      _id: existingUser._id,
      id: existingUser.id,
      name: existingUser.name,
      lastName: existingUser.lastName,
      email: existingUser.email,
    };

    const token = getSignedToken(userPayload);

    res.status(200).json({
      status: "success",
      data: userPayload,
      token,
    });
  }
);

export const signup = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, lastName, email, password, passwordConfirm } = req.body;

    if (
      handleSignupValidation(
        { name, lastName, email, password, passwordConfirm },
        next
      )
    ) {
      if (await handleUserExistanceValidation(email, next)) {
        const newUser = User.build({
          name,
          lastName,
          email,
          password,
          passwordConfirm,
        });

        await newUser.save();

        const userPayload: IUser = {
          _id: newUser._id,
          id: newUser._id,
          name: newUser.name,
          lastName: newUser.lastName,
          email: newUser.email,
        };
        const token = getSignedToken(userPayload);

        res.status(201).json({
          status: "success",
          data: userPayload,
          token,
        });
      }
    }
  }
);
