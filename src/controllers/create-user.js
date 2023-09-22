import validator from "validator";

import { badRequest, created, serverError } from "./helper.js";
import { CreateUserUseCase } from "../use-cases/create-user.js";
import { EmailIsAlreadyInUse } from "../errors/user.js";

export class CreateUserController {
  async execute(httpRequest) {
    try {
      const params = httpRequest.body;

      // Validar a requisição (campos obrigatórios, tamanho de senha e email)
      const requiredFiels = ["firstName", "lastName", "email", "password"];

      for (const field of requiredFiels) {
        if (!params[field] || params[field].trim().length === 0) {
          return badRequest({ errorMessage: `Missing param: ${field}` });
        }
      }

      if (params.password.length < 6) {
        return badRequest({
          errorMessage: "Password must be at least 6 characters",
        });
      }

      const emailIsValid = validator.isEmail(params.email);

      if (!emailIsValid) {
        return badRequest({ errorMessage: "Invalid e-mail" });
      }

      // Chamar use case
      const createUserUseCase = new CreateUserUseCase();

      const createdUser = await createUserUseCase.execute(params);

      // Retornar reposta ao usuário
      return created(createdUser);
    } catch (err) {
      console.error(err);
      if (err instanceof EmailIsAlreadyInUse) {
        return badRequest({ errorMessage: err.message });
      }
      return serverError();
    }
  }
}
