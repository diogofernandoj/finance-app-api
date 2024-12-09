import { compare } from "bcrypt";

export class PasswordComparatorAdapter {
  async execute(password, hashedPassword) {
    return compare(password, hashedPassword);
  }
}
