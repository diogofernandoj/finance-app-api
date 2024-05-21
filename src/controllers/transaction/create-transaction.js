import { ZodError } from "zod";
import { createTransactionSchema } from "../../schemas/index.js";
import {
  serverError,
  created,
  badRequest,
  userNotFoundResponse,
} from "../helpers/index.js";
import { UserNotFoundError } from "../../errors/user.js";

export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase;
  }
  async execute(httpRequest) {
    try {
      const createTransactionParams = httpRequest.body;

      await createTransactionSchema.parseAsync(createTransactionParams);

      const transaction = await this.createTransactionUseCase.execute(
        createTransactionParams,
      );

      return created(transaction);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest({ message: error.errors[0].message });
      }

      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse();
      }
      console.error(error);
      return serverError();
    }
  }
}
