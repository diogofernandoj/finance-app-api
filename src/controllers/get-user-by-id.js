import { GetUserByIdUseCase } from "../use-cases/get-user-by-id.js";
import { serverError, ok } from "./helper.js";

export class GetUserByIdController {
  async execute(httpRequest) {
    try {
      const getUserById = new GetUserByIdUseCase();

      const user = await getUserById.execute(httpRequest.params.userId);

      return ok(user);
    } catch (err) {
      console.error(err);
      return serverError();
    }
  }
}
