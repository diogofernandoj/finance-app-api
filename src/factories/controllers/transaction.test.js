import {
  CreateTransactionController,
  UpdateTransactionController,
} from "../../controllers/index.js";
import {
  makeCreateTransactionController,
  makeUpdateTransactionController,
} from "./transaction.js";

describe("Transaction Controller Factories", () => {
  it("should return a valid CreateTransactionController instance", () => {
    expect(makeCreateTransactionController()).toBeInstanceOf(
      CreateTransactionController,
    );
  });

  it("should return a valid UpdateTransactionController instance", () => {
    expect(makeUpdateTransactionController()).toBeInstanceOf(
      UpdateTransactionController,
    );
  });
});
