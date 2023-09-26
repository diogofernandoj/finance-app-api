import "dotenv/config.js";
import express from "express";

import {
  CreateUserController,
  GetUserByIdController,
  UpdateUserController,
} from "./src/controllers/index.js";

const app = express();

app.use(express.json());

app.post("/api/users", async (request, response) => {
  const createUserController = new CreateUserController();

  const { statusCode, body } = await createUserController.execute(request);

  response.status(statusCode).json(body);
});

app.get("/api/users/:userId", async (request, response) => {
  const getUserById = new GetUserByIdController();

  const { statusCode, body } = await getUserById.execute(request);

  response.status(statusCode).json(body);
});

app.patch("/api/users/:userId", async (request, response) => {
  const updateUser = new UpdateUserController();

  const { statusCode, body } = await updateUser.execute(request);

  response.status(statusCode).json(body);
});

app.listen(process.env.PORT, () =>
  console.log(`Listening on port ${process.env.PORT}`),
);
