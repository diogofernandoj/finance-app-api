import { GetUserByIdUseCase } from "../use-cases/index.js";
import {
  checkIfIdIsValid,
  invalidIdResponse,
  serverError,
  ok,
  notFound,
} from "./helpers/index.js";

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
