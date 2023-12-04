/* *** This script should be replaced with Sequelize Migration - Seeding *** */

import { BoothStatus, GoodsStockVisibility } from "@myboothmanager/common";
import * as argon2 from "argon2";
import Account from "@/db/models/account";
import Booth, { BoothCreationAttributes } from "@/db/models/booth";
import Goods, { GoodsCreationAttributes } from "@/db/models/goods";
import GoodsCategory, { GoodsCategoryCreationAttributes } from "@/db/models/goods-category";

const boothList: Array<BoothCreationAttributes> = [
  {
    ownerId: 1,
    name: "Main Test Booth",
    description: "Awesome Booth Main",
    location: "Somewhere",
    currencySymbol: "₩",
    status: BoothStatus.OPEN,
    dateOpen: new Date("2022-12-30"),
    dateClose: new Date("2023-01-01"),
  },
  {
    ownerId: 1,
    name: "Test booth #2",
    description: "Awesome Booth #2",
    location: "Over The Rainbow",
    currencySymbol: "$",
    status: BoothStatus.PAUSE,
    statusReason: "Lunch time ;)",
    dateOpen: new Date("2023-01-04"),
    dateClose: new Date("2023-01-05"),
  },
  {
    ownerId: 1,
    name: "Test booth #3",
    description: "Awesome Booth #3",
    location: "Over the Horizon",
    currencySymbol: "₩",
    status: BoothStatus.PREPARE,
    statusPublishContent: false,
    dateOpen: new Date("2023-01-20"),
    dateClose: new Date("2023-01-30"),
  },
  {
    ownerId: 1,
    name: "Test booth #4",
    description: "Awesome Booth #4",
    location: "In the middle of Sky",
    currencySymbol: "¥",
    status: BoothStatus.CLOSE,
    dateOpen: new Date("2023-03-03"),
    dateClose: new Date("2023-03-05"),
  },
];

const goodsCategoryList: Array<GoodsCategoryCreationAttributes> = [
  {
    boothId: -1,
    name: "블루아카이브",
  },
  {
    boothId: -1,
    name: "원신",
  },
  {
    boothId: -1,
    name: "기타",
  },
];

const goodsList: Array<GoodsCreationAttributes> = [
  {
    boothId: -1,
    categoryId: -1,
    name: "나히다 포토카드",
    price: 1000,
    stockInitial: 100,
    stockRemaining: 50,
    stockVisibility: GoodsStockVisibility.SHOW_ALL,
  },
  {
    boothId: -1,
    categoryId: -1,
    name: "프라나 아크릴 스탠드",
    price: 15000,
    stockInitial: 30,
    stockRemaining: 20,
    stockVisibility: GoodsStockVisibility.HIDE_ALL,
  },
  {
    boothId: -1,
    categoryId: -1,
    name: "모모이 SD 아크릴 키링",
    price: 8000,
    stockInitial: 20,
    stockRemaining: 10,
    stockVisibility: GoodsStockVisibility.SHOW_REMAINING_ONLY,
  },
  {
    boothId: -1,
    categoryId: -1,
    name: "Awesome Goods",
    price: 333333,
    stockInitial: 5,
    stockRemaining: 3,
    stockVisibility: GoodsStockVisibility.SHOW_ALL,
  },
];

export async function insertTempDataIntoDB(): Promise<void> {
  await Account.create({
    name: "TEST 2 (EMPTY)",
    loginId: "empty",
    loginPassHash: await argon2.hash("empty"),
  }, { ignoreDuplicates: true });
  const emptyAccount = await Account.findOne({ where: { loginId: "empty" } });
  (await Booth.findAll({ where: { ownerId: emptyAccount?.id } })).forEach(async (booth) => booth.destroy());

  if(await Account.findOne({ where: { loginId: "test" } })) return;

  await Account.create({
    name: "TEST",
    loginId: "test",
    loginPassHash: await argon2.hash("test"),
  }, {
    ignoreDuplicates: true,
  });

  const testAccount = await Account.findOne({ where: { loginId: "test" } });
  if(testAccount) {
    for(const booth of boothList) {
      booth.ownerId = testAccount.id;
      await Booth.create(booth);
    }
  }

  const mainBooth = await Booth.findOne({ where: { name: "Main Test Booth" } });
  if(mainBooth) {
    for(const goodsCategory of goodsCategoryList) {
      goodsCategory.boothId = mainBooth.id;
      await GoodsCategory.create(goodsCategory);
    }
  }

  const baCategory = await GoodsCategory.findOne({ where: { name: "블루아카이브" } });
  if(mainBooth && baCategory) {
    for(const goods of goodsList) {
      goods.boothId = mainBooth.id;
      goods.categoryId = baCategory.id;
      await Goods.create(goods);
    }
  }
}
