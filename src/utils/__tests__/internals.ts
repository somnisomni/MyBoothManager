import { BoothStatus, IBooth } from "../../interfaces";
import { WithSequelizeInternals } from "..";
import { deleteSequelizeInternalKeys } from "../internals";

const testBooth: IBooth = {
  id: 1234,
  ownerId: 5678,
  currencySymbol: "$",
  name: "TEST BOOTH",
  status: BoothStatus.OPEN,
  location: "SOMEWHERE",
  description: "DESCRIPTION",
};

const testBoothWithInternals: WithSequelizeInternals<IBooth> = {
  ...testBooth,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("src/utils/internals.ts", () => {
  it("should delete sequelize internal keys", () => {
    expect(testBoothWithInternals).toHaveProperty("createdAt");
    expect(testBoothWithInternals).toHaveProperty("updatedAt");

    const result = deleteSequelizeInternalKeys<IBooth>(testBoothWithInternals);

    expect(result).not.toHaveProperty("createdAt");
    expect(result).not.toHaveProperty("updatedAt");
  });

  it("should same after call deleteSequelizeInternalKeys for original data model object", () => {
    expect(testBooth).not.toHaveProperty("createdAt");
    expect(testBooth).not.toHaveProperty("updatedAt");

    const result = deleteSequelizeInternalKeys<IBooth>(testBooth);

    expect(result).not.toHaveProperty("createdAt");
    expect(result).not.toHaveProperty("updatedAt");

    expect(result).toStrictEqual(testBooth);
  });
});
