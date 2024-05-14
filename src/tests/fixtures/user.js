import { faker } from "@faker-js/faker";

export const user = {
  id: faker.string.uuid(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password({ length: 7 }),
};

export const userBalance = {
  earnings: 0,
  expenses: 0,
  invesments: 0,
  balance: 0,
};
