import { LoginUserUseCase } from "./login-user";
import { user } from "../../tests/fixtures/user";
import { UserNotFoundError } from "../../errors/user";

describe("LoginUserUseCase", () => {
  class GetUserByEmailRepositoryStub {
    async execute() {
      return user;
    }
  }

  class PasswordComparatorAdapterStub {
    async execute() {
      return true;
    }
  }

  class TokensGeneratorAdapterStub {
    async execute() {
      return {
        accessToken: "any_access_token",
        refreshToken: "any_refresh_token",
      };
    }
  }

  const makeSut = () => {
    const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub();
    const passwordComparatorAdapter = new PasswordComparatorAdapterStub();
    const tokensGeneratorAdapter = new TokensGeneratorAdapterStub();
    const sut = new LoginUserUseCase(
      getUserByEmailRepositoryStub,
      passwordComparatorAdapter,
      tokensGeneratorAdapter,
    );

    return { sut, getUserByEmailRepositoryStub, passwordComparatorAdapter };
  };

  it("should throw UserNotFoundError if user is not found", async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut();

    import.meta.jest
      .spyOn(getUserByEmailRepositoryStub, "execute")
      .mockResolvedValueOnce(null);

    const promise = sut.execute("any_email", "any_password");

    await expect(promise).rejects.toThrow(new UserNotFoundError());
  });

  it("should throw when password is not valid", async () => {
    const { sut, passwordComparatorAdapter } = makeSut();

    import.meta.jest
      .spyOn(passwordComparatorAdapter, "execute")
      .mockReturnValueOnce(false);

    const promise = sut.execute("any_email", "any_password");

    await expect(promise).rejects.toThrow("Invalid password");
  });

  it("should return user with tokens", async () => {
    const { sut } = makeSut();

    const result = await sut.execute("any_email", "any_password");

    expect(result.tokens).toBeDefined();
  });
});
