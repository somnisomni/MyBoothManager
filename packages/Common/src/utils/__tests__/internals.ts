import { BoothStatus, IBoothAdmin } from "../../interfaces/booth";
import { deleteSequelizeInternalKeys, WithSequelizeInternals } from "../internals";

const testBooth: IBoothAdmin = {
  id: 1234,
  ownerId: 5678,
  currencySymbol: "$",
  currencyCode: "USD",
  name: "TEST BOOTH",
  status: { status: BoothStatus.OPEN },
  location: "SOMEWHERE",
  description: "DESCRIPTION",
  expenses: [],
  dateOpen: new Date(),
  dateClose: new Date(),
};

const testBoothWithInternals: WithSequelizeInternals<IBoothAdmin> = {
  ...testBooth,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("src/utils/internals.ts", () => {
  it("should delete sequelize internal keys", () => {
    expect(testBoothWithInternals).toHaveProperty("createdAt");
    expect(testBoothWithInternals).toHaveProperty("updatedAt");

    const result = deleteSequelizeInternalKeys<IBoothAdmin>(testBoothWithInternals);

    expect(result).not.toHaveProperty("createdAt");
    expect(result).not.toHaveProperty("updatedAt");

    expect(result).toStrictEqual(testBooth);
  });

  it("should same after call deleteSequelizeInternalKeys for original data model object", () => {
    expect(testBooth).not.toHaveProperty("createdAt");
    expect(testBooth).not.toHaveProperty("updatedAt");

    const result = deleteSequelizeInternalKeys<IBoothAdmin>(testBooth);

    expect(result).not.toHaveProperty("createdAt");
    expect(result).not.toHaveProperty("updatedAt");

    expect(result).toStrictEqual(testBooth);
  });
});
