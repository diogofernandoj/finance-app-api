import validator from "validator";

import { badRequest, ok, serverError } from "./helper.js";
import { UpdateUserUseCase } from "../use-cases/update-user.js";
import { EmailIsAlreadyInUseError } from "../errors/user.js";

export class UpdateUserController {
  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.userId;

      const idIsValid = validator.isUUID(userId);

      if (!idIsValid) {
        return badRequest({ errorMessage: "The provided id is not valid" });
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
        const passwordIsValid = updateUserParams.password.length > 6;

        if (!passwordIsValid) {
          return badRequest({
            errorMessage: "Password must be at least 6 characters",
          });
        }
      }

      if (updateUserParams.email) {
        const emailIsValid = validator.isEmail(updateUserParams.email);

        if (!emailIsValid) {
          return badRequest({ errorMessage: "The provided e-mail is invalid" });
        }
      }

      const updateUser = new UpdateUserUseCase();

      const updatedUser = await updateUser.execute(userId, updateUserParams);

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
