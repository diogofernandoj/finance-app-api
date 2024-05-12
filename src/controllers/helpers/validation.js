import validator from "validator";
import { badRequest } from "./http.js";

export const checkIfIdIsValid = (id) => validator.isUUID(id);

export const invalidIdResponse = () =>
  badRequest({ errorMessage: "The provided id is not valid" });

export const requiredFieldIsMissingResponse = (field) => {
  return badRequest({ errorMessage: `The field ${field} is required` });
};
