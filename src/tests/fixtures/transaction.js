import { faker } from "@faker-js/faker";
import { TransactionType } from "@prisma/client";

export const transaction = {
  id: faker.string.uuid(),
  user_id: faker.string.uuid(),
  title: faker.string.alpha(10),
  date: faker.date.anytime().toISOString(),
  type: faker.helpers.enumValue(TransactionType),
  amount: faker.number.float({ min: 1, fractionDigits: 2 }),
};
