import { IdGeneratorAdapter } from "./id-generator.js";

describe("IdGeneratorAdapter", () => {
  it("should return a random id", async () => {
    const sut = new IdGeneratorAdapter();

    const res = sut.execute();

    expect(res).toBeTruthy();
    expect(typeof res).toBe("string");
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(res).toMatch(uuidRegex);
  });
});
