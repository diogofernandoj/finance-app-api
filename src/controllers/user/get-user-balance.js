import {
  serverError,
  checkIfIdIsValid,
  invalidIdResponse,
  userNotFoundResponse,
  ok,
} from "../helpers/index.js";

import { UserNotFoundError } from "../../errors/user.js";

export class GetUserBalanceController {
  constructor(getUserBalanceUseCase) {
    this.getUserBalanceUseCase = getUserBalanceUseCase;
  }

  async execute(httpRequest) {
    const userId = httpRequest.params.userId;

    try {
      const idIsValid = checkIfIdIsValid(userId);

      if (!idIsValid) {
        return invalidIdResponse();
      }

      const balance = await this.getUserBalanceUseCase.execute({ userId });

      return ok(balance);
    } catch (error) {
      console.error(error);
      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse();
      }

      return serverError();
    }
  }
}
