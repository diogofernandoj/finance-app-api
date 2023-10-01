import {
  checkIfIdIsValid,
  invalidIdResponse,
  serverError,
  badRequest,
  checkIfAmountIsValid,
  invalidAmountResponse,
  checkIfTypeIsValid,
  invalidTypeResponse,
  ok,
} from "../helpers/index.js";

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

      const allowedFields = ["title", "date", "amount", "type"];

      const someFieldIsNotAllowed = Object.keys(updateTransactionParams).some(
        (field) => !allowedFields.includes(field),
      );

      if (someFieldIsNotAllowed) {
        return badRequest({
          errorMessage: "Some provided field is not allowed",
        });
      }

      if (updateTransactionParams.amount) {
        const amountIsValid = checkIfAmountIsValid(
          updateTransactionParams.amount,
        );

        if (!amountIsValid) {
          return invalidAmountResponse();
        }
      }

      if (updateTransactionParams.type) {
        const typeIsValid = checkIfTypeIsValid(updateTransactionParams.type);

        if (!typeIsValid) {
          return invalidTypeResponse();
        }
      }

      const transaction = await this.updateTransactionUseCase.execute(
        transactionId,
        updateTransactionParams,
      );

      return ok(transaction);
    } catch (error) {
      console.error(error);

      return serverError();
    }
  }
}
