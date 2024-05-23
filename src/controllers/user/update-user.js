import { ZodError } from "zod";
import {
  EmailIsAlreadyInUseError,
  UserNotFoundError,
} from "../../errors/user.js";
import { updateUserSchema } from "../../schemas/user.js";
import {
  checkIfIdIsValid,
  invalidIdResponse,
  badRequest,
  ok,
  serverError,
  userNotFoundResponse,
} from "../helpers/index.js";

export class UpdateUserController {
  constructor(updateUserUseCase) {
    this.updateUserUseCase = updateUserUseCase;
  }

  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.userId;

      const idIsValid = checkIfIdIsValid(userId);

      if (!idIsValid) {
        return invalidIdResponse();
      }

      const updateUserParams = httpRequest.body;

      await updateUserSchema.parseAsync(updateUserParams);

      const updatedUser = await this.updateUserUseCase.execute(
        userId,
        updateUserParams,
      );

      return ok(updatedUser);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest({
          message: error.errors[0].message,
        });
      }
      console.error(error);

      if (error instanceof EmailIsAlreadyInUseError) {
        return badRequest({
          errorMessage: error.message,
        });
      }

      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse();
      }

      return serverError();
    }
  }
}
