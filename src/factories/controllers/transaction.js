import {
  PostgresCreateTransactionRepository,
  PostgresGetTransactionsByUserIdRepository,
  PostgresGetUserByIdRepository,
} from "../../repositories/postgres/index.js";
import {
  CreateTransactionUseCase,
  GetTransactionsByUserIdUseCase,
} from "../../use-cases/index.js";
import {
  CreateTransactionController,
  GetTransactionsByUserIdController,
} from "../../controllers/index.js";

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

export const makeGetTransactionsByUserIdController = () => {
  const getTransactionsByUserIdRepository =
    new PostgresGetTransactionsByUserIdRepository();

  const getUserById = new PostgresGetUserByIdRepository();

  const getTransactionsByUserIdUseCase = new GetTransactionsByUserIdUseCase(
    getTransactionsByUserIdRepository,
    getUserById,
  );

  const getTransactionsByUserIdController =
    new GetTransactionsByUserIdController(getTransactionsByUserIdUseCase);

  return getTransactionsByUserIdController;
};
