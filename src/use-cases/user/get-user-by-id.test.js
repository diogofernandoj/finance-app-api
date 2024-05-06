import { faker } from "@faker-js/faker";
import { GetUserByIdUseCase } from "../index.js";

describe("GetUserByIdUseCase", () => {
  const user = {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 7 }),
  };

  class GetUserByIdRepositoryStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const sut = new GetUserByIdUseCase(getUserByIdRepository);

    return { sut, getUserByIdRepository };
  };

  it("should get user by id successfully", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute(faker.string.uuid());

    // assert
    expect(res).toEqual(user);
  });

  it("should call GetUserByIdRepository with correct param", async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut();
    const executeSpy = jest.spyOn(getUserByIdRepository, "execute");
    const userId = faker.string.uuid();

    // act
    await sut.execute(userId);

    // assert
    expect(executeSpy).toHaveBeenCalledWith(userId);
  });
});
