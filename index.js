import "dotenv/config.js";
import express from "express";

import {
  CreateUserController,
  DeleteUserController,
  GetUserByIdController,
  UpdateUserController,
} from "./src/controllers/index.js";
import {
  PostgresGetUserByIdRepository,
  PostgresCreateUserRepository,
  PostgresGetUserByEmailRepository,
  PostgresUpdateUserRepository,
  PostgresDeleteUserRepository,
} from "./src/repositores/postgres/index.js";
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
} from "./src/use-cases/index.js";

const app = express();

app.use(express.json());

app.post("/api/users", async (request, response) => {
  const createUserRepository = new PostgresCreateUserRepository();

  const getUserByEmail = new PostgresGetUserByEmailRepository();

  const createUserUseCase = new CreateUserUseCase(
    createUserRepository,
    getUserByEmail,
  );

  const createUserController = new CreateUserController(createUserUseCase);

  const { statusCode, body } = await createUserController.execute(request);

  response.status(statusCode).json(body);
});

app.get("/api/users/:userId", async (request, response) => {
  const getUserByIdRepository = new PostgresGetUserByIdRepository();

  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository);

  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase);

  const { statusCode, body } = await getUserByIdController.execute(request);

  response.status(statusCode).json(body);
});

app.patch("/api/users/:userId", async (request, response) => {
  const updateUserRepository = new PostgresUpdateUserRepository();

  const getUserByEmail = new PostgresGetUserByEmailRepository();

  const updateUserUseCase = new UpdateUserUseCase(
    updateUserRepository,
    getUserByEmail,
  );

  const updateUserController = new UpdateUserController(updateUserUseCase);

  const { statusCode, body } = await updateUserController.execute(request);

  response.status(statusCode).json(body);
});

app.delete("/api/users/:userId", async (request, response) => {
  const deleteUserRepository = new PostgresDeleteUserRepository();

  const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository);

  const deleteUserController = new DeleteUserController(deleteUserUseCase);

  const { statusCode, body } = await deleteUserController.execute(request);

  response.status(statusCode).json(body);
});

app.listen(process.env.PORT, () =>
  console.log(`Listening on port ${process.env.PORT}`),
);
