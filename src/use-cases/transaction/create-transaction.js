import { UserNotFoundError } from "../../errors/user.js";

export class CreateTransactionUseCase {
  constructor(createTransactionRepository, getUserById, idGeneratorAdapter) {
    this.createTransactionRepository = createTransactionRepository;
    this.getUserById = getUserById;
    this.idGeneratorAdapter = idGeneratorAdapter;
  }

  async execute(createTransactionParams) {
    const userId = createTransactionParams.user_id;

    const user = await this.getUserById.execute(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const transactionId = await this.idGeneratorAdapter.execute();

    const transaction = await this.createTransactionRepository.execute({
      ...createTransactionParams,
      id: transactionId,
    });

    return transaction;
  }
}
