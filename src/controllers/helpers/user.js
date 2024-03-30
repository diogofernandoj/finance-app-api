import { badRequest, notFound } from "./http.js";

export const invalidPasswordResponse = () =>
  badRequest({ errorMessage: "Password must be at least 6 characters" });

export const invalidEmailResponse = () =>
  badRequest({ errorMessage: "The provided e-mail is not valid" });

export const userNotFoundResponse = () =>
  notFound({ errorMessage: "User not found" });
