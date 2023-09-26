import {
  checkIfIdIsValid,
  invalidIdResponse,
  serverError,
  ok,
  userNotFoundResponse,
} from "./helpers/index.js";

export class GetUserByIdController {
  constructor(getUserByIdUseCase) {
    this.getUserByIdUseCase = getUserByIdUseCase;
  }

  async execute(httpRequest) {
    try {
      const idIsValid = checkIfIdIsValid(httpRequest.params.userId);

      if (!idIsValid) {
        return invalidIdResponse();
      }

      const user = await this.getUserByIdUseCase.execute(
        httpRequest.params.userId,
      );

      if (!user) {
        return userNotFoundResponse();
      }

      return ok(user);
    } catch (err) {
      console.error(err);
      return serverError();
    }
  }
}
