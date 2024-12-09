import * as argon2 from "argon2";
import { BoothStatus, GoodsStockVisibility, IAccountModel, IBoothModel, IGoodsCategoryModel, IGoodsCombinationModel, IGoodsModel } from "@myboothmanager/common";
import { WhereOptions, Op } from "sequelize";
import Account from "@/db/models/account";
import Booth from "@/db/models/booth";
import GoodsCategory from "@/db/models/goods-category";
import Goods from "@/db/models/goods";
import GoodsCombination from "@/db/models/goods-combination";
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
  ] as IAccountModel[]);

  // Booth
  const testAccount = await Account.findOne({ where: { loginId: "test" } });
  if(testAccount) {
    await context.bulkInsert(Booth.name, [
      {
        ownerId: testAccount.id,
        name: "[T] Main Test Booth",
        description: "Awesome Booth for testing",
        location: "Somewhere over the rainbow",
        status: BoothStatus.OPEN,
        dateOpen: new Date("2023-01-01"),
        dateClose: new Date("2025-01-01"),
      },
      {
        ownerId: testAccount.id,
        name: "[T] Test booth #2",
        description: "Awesome Booth #2",
        location: "Icheon, South Korea",
        status: BoothStatus.PAUSE,
        statusReason: "Lunch time ;)",
        dateOpen: new Date("2023-03-01"),
        dateClose: new Date("2026-03-01"),
      },
    ] as IBoothModel[]);
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
    ] as IGoodsCategoryModel[]);
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
    ] as IGoodsCombinationModel[]);
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
    ] as IGoodsModel[]);
  }
};

export const down: Seeder = async ({ context }) => {
  await context.bulkDelete(Goods.name, {
    [Op.startsWith]: "[T]",
  } as WhereOptions<IGoodsModel>);

  await context.bulkDelete(GoodsCombination.name, {
    [Op.startsWith]: "[T]",
  } as WhereOptions<IGoodsCombinationModel>);

  await context.bulkDelete(GoodsCategory.name, {
    [Op.startsWith]: "[T]",
  } as WhereOptions<IGoodsCategoryModel>);

  await context.bulkDelete(Booth.name, {
    [Op.startsWith]: "[T]",
  } as WhereOptions<IBoothModel>);

  await context.bulkDelete(Account.name, {
    [Op.startsWith]: "[T]",
  } as WhereOptions<IAccountModel>);
};
