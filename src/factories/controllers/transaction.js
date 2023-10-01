import {
  PostgresCreateTransactionRepository,
  PostgresGetUserByIdRepository,
} from "../../repositories/postgres/index.js";
import { CreateTransactionUseCase } from "../../use-cases/index.js";
import { CreateTransactionController } from "../../controllers/index.js";

export const makeCreateTransactionController = () => {
  const createTransactionRepository = new PostgresCreateTransactionRepository();
  const getUserById = new PostgresGetUserByIdRepository();

  const createTransactionUseCase = new CreateTransactionUseCase(
    createTransactionRepository,
    getUserById,
  );

  const createTransactionController = new CreateTransactionController(
    createTransactionUseCase,
  );

  return createTransactionController;
};
