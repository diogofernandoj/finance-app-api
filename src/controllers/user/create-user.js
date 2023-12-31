import { EmailIsAlreadyInUseError } from "../../errors/user.js";
import {
  checkIfEmailIsValid,
  checkIfPasswordIsValid,
  invalidEmailResponse,
  invalidPasswordResponse,
  badRequest,
  created,
  serverError,
  validateRequiredFields,
  requiredFieldIsMissingResponse,
} from "../helpers/index.js";

export class CreateUserController {
  constructor(createUserUseCase) {
    this.createUserUseCase = createUserUseCase;
  }

  async execute(httpRequest) {
    try {
      const createUserParams = httpRequest.body;

      // Validar a requisição (campos obrigatórios, tamanho de senha e email)
      const requiredFields = ["firstName", "lastName", "email", "password"];

      const { missingField } = validateRequiredFields(
        createUserParams,
        requiredFields,
      );

      if (missingField) {
        return requiredFieldIsMissingResponse(missingField);
      }

      const passwordIsValid = checkIfPasswordIsValid(createUserParams.password);

      if (!passwordIsValid) {
        return invalidPasswordResponse();
      }

      const emailIsValid = checkIfEmailIsValid(createUserParams.email);

      if (!emailIsValid) {
        return invalidEmailResponse();
      }

      // Chamar use case

      const createdUser =
        await this.createUserUseCase.execute(createUserParams);

      // Retornar reposta ao usuário
      return created(createdUser);
    } catch (err) {
      console.error(err);
      if (err instanceof EmailIsAlreadyInUseError) {
        return badRequest({ errorMessage: err.message });
      }
      return serverError();
    }
  }
}
