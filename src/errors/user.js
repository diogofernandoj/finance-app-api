export class EmailIsAlreadyInUseError extends Error {
  constructor(email) {
    super(`The email ${email} is already in use`);
    this.name = "EmailIsAlreadyInUseError";
  }
}
