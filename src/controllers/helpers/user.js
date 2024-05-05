import { notFound } from "./http.js";

export const userNotFoundResponse = () =>
  notFound({ errorMessage: "User not found" });
