import { EmailIsAlreadyInUseError } from "../../errors/user.js";

export class CreateUserUseCase {
  constructor(
    createUserRepository,
    getUserByEmail,
    passwordHasherAdapter,
    idGeneratorAdapter,
  ) {
    this.createUserRepository = createUserRepository;
    this.getUserByEmail = getUserByEmail;
    this.passwordHasherAdapter = passwordHasherAdapter;
    this.idGeneratorAdapter = idGeneratorAdapter;
  }

  async execute(createUserParams) {
    const userAlreadyExists = await this.getUserByEmail.execute(
      createUserParams.email,
    );

    if (userAlreadyExists) {
      throw new EmailIsAlreadyInUseError(createUserParams.email);
    }

    const userId = await this.idGeneratorAdapter.execute();

    const hashedPassword = await this.passwordHasherAdapter.execute(
      createUserParams.password,
    );

    const user = {
      ...createUserParams,
      id: userId,
      password: hashedPassword,
    };

    const createdUser = await this.createUserRepository.execute(user);

    return createdUser;
  }
}
