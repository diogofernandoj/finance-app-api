import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { EmailIsAlreadyInUseError } from "../errors/user.js";

export class CreateUserUseCase {
  constructor(createUserRepository, getUserByEmail) {
    this.createUserRepository = createUserRepository;
    this.getUserByEmail = getUserByEmail;
  }

  async execute(createUserParams) {
    const userAlreadyExists = await this.getUserByEmail.execute(
      createUserParams.email,
    );

    if (userAlreadyExists) {
      throw new EmailIsAlreadyInUseError(createUserParams.email);
    }

    const userId = uuidv4();

    const hashedPassword = await bcrypt.hash(createUserParams.password, 10);

    const user = {
      ...createUserParams,
      id: userId,
      password: hashedPassword,
    };

    const createdUser = await this.createUserRepository.execute(user);

    return createdUser;
  }
}
