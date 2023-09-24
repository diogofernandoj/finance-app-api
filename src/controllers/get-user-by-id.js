import validator from "validator";

import { GetUserByIdUseCase } from "../use-cases/get-user-by-id.js";
import { serverError, ok, notFound, badRequest } from "./helper.js";

export class GetUserByIdController {
  async execute(httpRequest) {
    try {
      const isIdValid = validator.isUUID(httpRequest.params.userId);

      if (!isIdValid) {
        return badRequest({ errorMessage: "The provided id is not valid" });
      }

      const getUserById = new GetUserByIdUseCase();

      const user = await getUserById.execute(httpRequest.params.userId);

      if (!user) {
        return notFound({ errorMessage: "User not found" });
      }

      return ok(user);
    } catch (err) {
      console.error(err);
      return serverError();
    }
  }
}
