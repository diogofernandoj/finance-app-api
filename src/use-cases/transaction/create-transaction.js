import { v4 as uuidv4 } from "uuid";

import { UserNotFoundError } from "../../errors/user.js";

export class CreateTransactionUseCase {
  constructor(createTransactionRepository, getUserById) {
    this.createTransactionRepository = createTransactionRepository;
    this.getUserById = getUserById;
  }

  async execute(createTransactionParams) {
    const userId = createTransactionParams.id;

    const user = await this.getUserById.execute(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const transactionId = uuidv4();

    const transaction = await this.createTransactionRepository.execute({
      ...createTransactionParams,
      id: transactionId,
    });

    return transaction;
  }
}
