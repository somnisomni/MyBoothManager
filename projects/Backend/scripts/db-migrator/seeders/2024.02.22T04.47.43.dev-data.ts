import * as argon2 from "argon2";
import { BoothStatus, GoodsStockVisibility } from "@myboothmanager/common";
import { WhereOptions , Op } from "sequelize";
import Account, { AccountCreationAttributes } from "@/db/models/account";
import Booth, { BoothCreationAttributes } from "@/db/models/booth";
import GoodsCategory, { GoodsCategoryCreationAttributes } from "@/db/models/goods-category";
import Goods, { GoodsCreationAttributes } from "@/db/models/goods";
import GoodsCombination, { GoodsCombinationCreationAttributes } from "@/db/models/goods-combination";
import { Seeder } from "../umzug";

export const up: Seeder = async ({ context }) => {
  // Account
  await context.bulkInsert(Account.name, [
    {
      name: "[T] TEST",
      loginId: "test",
      loginPassHash: await argon2.hash("test"),
    },
    {
      name: "[T] TEST 2 (EMPTY)",
      loginId: "empty",
      loginPassHash: await argon2.hash("empty"),
    },
  ] as AccountCreationAttributes[]);

  // Booth
  const testAccount = await Account.findOne({ where: { loginId: "test" } });
  if(testAccount) {
    await context.bulkInsert(Booth.name, [
      {
        ownerId: testAccount.id,
        name: "[T] Main Test Booth",
        description: "Awesome Booth for testing",
        location: "Somewhere over the rainbow",
        currencySymbol: "₩",
        status: BoothStatus.OPEN,
        dateOpen: new Date("2023-01-01"),
        dateClose: new Date("2025-01-01"),
      },
      {
        ownerId: testAccount.id,
        name: "[T] Test booth #2",
        description: "Awesome Booth #2",
        location: "Icheon, South Korea",
        currencySymbol: "$",
        status: BoothStatus.PAUSE,
        statusReason: "Lunch time ;)",
        dateOpen: new Date("2023-03-01"),
        dateClose: new Date("2026-03-01"),
      },
    ] as BoothCreationAttributes[]);
  }

  // Goods Category
  const testBooth = await Booth.findOne({ where: { name: "[T] Main Test Booth" } });
  if(testBooth) {
    await context.bulkInsert(GoodsCategory.name, [
      {
        boothId: testBooth.id,
        name: "[T] Test Category 1",
      },
      {
        boothId: testBooth.id,
        name: "[T] Awesome Goods",
      },
    ] as GoodsCategoryCreationAttributes[]);
  }

  // Goods Combination
  const testCategory = await GoodsCategory.findOne({ where: { name: "[T] Test Category 1" } });
  if(testBooth && testCategory) {
    await context.bulkInsert(GoodsCombination.name, [
      {
        boothId: testBooth.id,
        categoryId: testCategory.id,
        name: "[T] It's A Good Deal!",
        price: 50000,
        stockVisibility: GoodsStockVisibility.SHOW_REMAINING_ONLY,
      },
    ] as GoodsCombinationCreationAttributes[]);
  }

  // Goods
  const testCombination = await GoodsCombination.findOne({ where: { name: "[T] It's A Good Deal!" } });
  if(testBooth && testCategory && testCombination) {
    await context.bulkInsert(Goods.name, [
      {
        boothId: testBooth.id,
        categoryId: null,
        name: "[T] Test Goods 1",
        price: 10000,
        stockInitial: 50,
        stockRemaining: 50,
        stockVisibility: GoodsStockVisibility.SHOW_REMAINING_ONLY,
      },
      {
        boothId: testBooth.id,
        categoryId: testCategory.id,
        combinationId: testCombination.id,
        name: "[T] Awesome Goods!",
        price: 25000,
        stockInitial: 100,
        stockRemaining: 30,
        stockVisibility: GoodsStockVisibility.SHOW_ALL,
      },
      {
        boothId: testBooth.id,
        categoryId: testCategory.id,
        combinationId: testCombination.id,
        name: "[T] Acrylic Stand",
        price: 33333,
        stockInitial: 15,
        stockRemaining: 10,
        stockVisibility: GoodsStockVisibility.HIDE_ALL,
      },
      {
        boothId: testBooth.id,
        categoryId: testCategory.id,
        name: "[T] Plana Acrylic Keyring",
        price: 8000,
        stockInitial: 20,
        stockRemaining: 15,
        stockVisibility: GoodsStockVisibility.SHOW_REMAINING_ONLY,
      },
    ] as GoodsCreationAttributes[]);
  }
};

export const down: Seeder = async ({ context }) => {
  await context.bulkDelete(Goods.name, {
    [Op.startsWith]: "[T]",
  } as WhereOptions<GoodsCreationAttributes>);

  await context.bulkDelete(GoodsCombination.name, {
    [Op.startsWith]: "[T]",
  } as WhereOptions<GoodsCombinationCreationAttributes>);

  await context.bulkDelete(GoodsCategory.name, {
    [Op.startsWith]: "[T]",
  } as WhereOptions<GoodsCategoryCreationAttributes>);

  await context.bulkDelete(Booth.name, {
    [Op.startsWith]: "[T]",
  } as WhereOptions<BoothCreationAttributes>);

  await context.bulkDelete(Account.name, {
    [Op.startsWith]: "[T]",
  } as WhereOptions<AccountCreationAttributes>);
};
