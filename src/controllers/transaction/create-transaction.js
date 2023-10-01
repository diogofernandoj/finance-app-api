import validator from "validator";

import {
  serverError,
  badRequest,
  checkIfIdIsValid,
  invalidIdResponse,
  created,
} from "../helpers/index.js";

export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase;
  }
  async execute(httpRequest) {
    try {
      const createTransactionParams = httpRequest.body;

      const requiredFiels = ["user_id", "title", "date", "amount", "type"];

      for (const field of requiredFiels) {
        if (
          !createTransactionParams[field] ||
          createTransactionParams[field].trim().length === 0
        ) {
          return badRequest({ errorMessage: `Missing param: ${field}` });
        }
      }

      const idIsValid = checkIfIdIsValid(createTransactionParams.user_id);

      if (!idIsValid) {
        invalidIdResponse();
      }

      if (createTransactionParams.amount <= 0) {
        return badRequest({
          errorMessage: "The amount must be greater than 0",
        });
      }

      const amountIsValid = validator.isCurrency(
        createTransactionParams.amount.toString(),
        {
          digits_after_decimal: [2],
          allow_negatives: false,
          decimal_separator: ".",
        },
      );

      if (!amountIsValid) {
        return badRequest({
          errorMessage: "The amount must be a valid currency",
        });
      }

      const type = createTransactionParams.type.trim().toUpperCase();

      const typeIsValid = ["EARNING", "EXPENSE", "INVESTMENT"].includes(type);

      if (!typeIsValid) {
        return badRequest({
          errorMessage:
            "The type must be either EARNING, EXPENSE or INVESTMENT",
        });
      }

      const transaction = await this.createTransactionUseCase.execute({
        ...createTransactionParams,
        type,
      });

      return created(transaction);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}