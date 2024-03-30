import { EmailIsAlreadyInUseError } from "../../errors/user.js";
import { badRequest, created, serverError } from "../helpers/index.js";
import { ZodError } from "zod";
import { createUserSchema } from "../../schemas/index.js";

export class CreateUserController {
  constructor(createUserUseCase) {
    this.createUserUseCase = createUserUseCase;
  }

  async execute(httpRequest) {
    try {
      const createUserParams = httpRequest.body;

      await createUserSchema.parseAsync(createUserParams);

      const createdUser =
        await this.createUserUseCase.execute(createUserParams);

      // Retornar reposta ao usuário
      return created(createdUser);
    } catch (err) {
      if (err instanceof ZodError) {
        return badRequest({
          message: err.errors[0].message,
        });
      }
      console.error(err);
      if (err instanceof EmailIsAlreadyInUseError) {
        return badRequest({ errorMessage: err.message });
      }
      return serverError();
    }
  }
}
