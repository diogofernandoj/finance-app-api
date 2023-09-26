import { UpdateUserUseCase } from "../use-cases/index.js";
import { EmailIsAlreadyInUseError } from "../errors/user.js";
import {
  checkIfEmailIsValid,
  checkIfIdIsValid,
  checkIfPasswordIsValid,
  invalidEmailResponse,
  invalidIdResponse,
  invalidPasswordResponse,
  badRequest,
  ok,
  serverError,
} from "./helpers/index.js";

export class UpdateUserController {
  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.userId;

      const idIsValid = checkIfIdIsValid(userId);

      if (!idIsValid) {
        return invalidIdResponse();
      }

      const updateUserParams = httpRequest.body;

      const allowedFields = ["firstName", "lastName", "email", "password"];

      const someFieldIsNotAllowed = Object.keys(updateUserParams).some(
        (field) => !allowedFields.includes(field),
      );

      if (someFieldIsNotAllowed) {
        return badRequest({
          errorMessage: "Some provided field is not allowed",
        });
      }

      if (updateUserParams.password) {
        const passwordIsValid = checkIfPasswordIsValid(
          updateUserParams.password,
        );

        if (!passwordIsValid) {
          return invalidPasswordResponse();
        }
      }

      if (updateUserParams.email) {
        const emailIsValid = checkIfEmailIsValid(updateUserParams.email);

        if (!emailIsValid) {
          return invalidEmailResponse();
        }
      }

      const updateUserUseCase = new UpdateUserUseCase();

      const updatedUser = await updateUserUseCase.execute(
        userId,
        updateUserParams,
      );

      return ok(updatedUser);
    } catch (error) {
      console.error(error);

      if (error instanceof EmailIsAlreadyInUseError) {
        return badRequest({
          errorMessage: error.message,
        });
      }

      return serverError();
    }
  }
}
