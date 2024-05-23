import { ZodError } from "zod";
import { updateTransactionSchema } from "../../schemas/index.js";
import {
  checkIfIdIsValid,
  invalidIdResponse,
  serverError,
  ok,
  transactionNotFoundResponse,
  badRequest,
} from "../helpers/index.js";
import { TransactionNotFoundError } from "../../errors/transaction.js";

export class UpdateTransactionController {
  constructor(updateTransactionUseCase) {
    this.updateTransactionUseCase = updateTransactionUseCase;
  }

  async execute(httpRequest) {
    try {
      const transactionId = httpRequest.params.transactionId;

      const idIsValid = checkIfIdIsValid(transactionId);

      if (!idIsValid) {
        return invalidIdResponse();
      }

      const updateTransactionParams = httpRequest.body;

      await updateTransactionSchema.parseAsync(updateTransactionParams);

      const transaction = await this.updateTransactionUseCase.execute(
        transactionId,
        updateTransactionParams,
      );

      if (!transaction) {
        return transactionNotFoundResponse();
      }

      return ok(transaction);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest({
          message: error.errors[0].message,
        });
      }

      if (error instanceof TransactionNotFoundError) {
        return transactionNotFoundResponse();
      }

      console.error(error);

      return serverError();
    }
  }
}
