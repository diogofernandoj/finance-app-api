import { GetUserByIdUseCase } from "../use-cases/get-user-by-id.js";
import { serverError, ok, notFound } from "./helper/http.js";
import { checkIfIdIsValid, invalidIdResponse } from "./helpers/user.js";

export class GetUserByIdController {
  async execute(httpRequest) {
    try {
      const idIsValid = checkIfIdIsValid(httpRequest.params.userId);

      if (!idIsValid) {
        return invalidIdResponse();
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
