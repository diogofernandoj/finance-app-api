import { notFound } from "./http.js";

export const transactionNotFoundResponse = () => {
  return notFound({ errorMessage: "Transaction not found" });
};
