import validator from "validator";

import { badRequest } from "./http";

export const invalidPasswordResponse = () =>
  badRequest({ errorMessage: "Password must be at least 6 characters" });

export const invalidEmailResponse = () =>
  badRequest({ errorMessage: "The provided e-mail is not valid" });

export const invalidIdResponse = () =>
  badRequest({ errorMessage: "The provided id is not valid" });

export const checkIfPasswordIsValid = (password) => password.length >= 6;

export const checkIfEmailIsValid = (email) => validator.isEmail(email);

export const checkIfIdIsValid = (id) => validator.isUUID(id);
