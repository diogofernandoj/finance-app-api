import validator from "validator";
import { badRequest } from "./http.js";

export const checkIfIdIsValid = (id) => validator.isUUID(id);

export const invalidIdResponse = () =>
  badRequest({ errorMessage: "The provided id is not valid" });

export const requiredFieldIsMissingResponse = (field) => {
  return badRequest({ errorMessage: `The field ${field} is required` });
};

const checkIfIsString = (value) => typeof value === "string";

export const validateRequiredFields = (params, requiredFields) => {
  for (const field of requiredFields) {
    const fieldIsMissing = !params[field];
    const fieldIsEmpty =
      checkIfIsString(params[field]) &&
      validator.isEmpty(params[field], { ignore_whitespace: true });
    if (fieldIsMissing || fieldIsEmpty) {
      return {
        missingField: field,
      };
    }
  }
  return {
    missingField: null,
  };
};
