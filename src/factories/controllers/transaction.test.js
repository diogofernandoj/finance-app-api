import { CreateTransactionController } from "../../controllers/index.js";
import { makeCreateTransactionController } from "./transaction.js";

describe("Transaction Controller Factories", () => {
  it("should return a valid CreateTransactionController instance", () => {
    expect(makeCreateTransactionController()).toBeInstanceOf(
      CreateTransactionController,
    );
  });
});
