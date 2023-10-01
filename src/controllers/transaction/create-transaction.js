import {
  serverError,
  checkIfIdIsValid,
  invalidIdResponse,
  created,
  validateRequiredFields,
  requiredFieldIsMissingResponse,
} from "../helpers/index.js";
import {
  checkIfAmountIsValid,
  checkIfTypeIsValid,
  invalidAmountResponse,
  invalidTypeResponse,
} from "../helpers/transaction.js";

export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase;
  }
  async execute(httpRequest) {
    try {
      const createTransactionParams = httpRequest.body;

      const requiredFields = ["user_id", "title", "date", "amount", "type"];

      const { missingField } = validateRequiredFields(
        createTransactionParams,
        requiredFields,
      );

      if (missingField) {
        return requiredFieldIsMissingResponse(missingField);
      }

      const idIsValid = checkIfIdIsValid(createTransactionParams.user_id);

      if (!idIsValid) {
        invalidIdResponse();
      }

      const amountIsValid = checkIfAmountIsValid(
        createTransactionParams.amount,
      );

      if (!amountIsValid) {
        return invalidAmountResponse();
      }

      const type = createTransactionParams.type.trim().toUpperCase();

      const typeIsValid = checkIfTypeIsValid(type);

      if (!typeIsValid) {
        return invalidTypeResponse();
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
