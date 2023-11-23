import { Sequelize } from "sequelize";
import Account, { accountModelAttrib, accountModelName } from "./models/account";
import generateConfig from "./config";
import Booth, { boothModelAttrib, boothModelName } from "./models/booth";
import Goods, { goodsModelAttrib, goodsModelName } from "./models/goods";
import GoodsCategory, { goodsCategoryAdditionalUniqueIndex, goodsCategoryModelAttrib, goodsCategoryModelName } from "./models/goods-category";
import GoodsOrder, { goodsOrderModelAttrib, goodsOrderModelName } from "./models/goods-order";

export default class MBMSequelize {
  private static _instance: Sequelize | null = null;

  static get instance(): Sequelize {
    if(!MBMSequelize._instance) throw new Error("Sequelize instance is not initialized! You need to set-up the instance using setup() function first.");

    return MBMSequelize._instance;
  }

  private static async setupModels(): Promise<void> {
    /* == Model initialization == */
    Account.init(accountModelAttrib, { sequelize: MBMSequelize.instance, modelName: accountModelName });
    Booth.init(boothModelAttrib, { sequelize: MBMSequelize.instance, modelName: boothModelName });
    Goods.init(goodsModelAttrib, { sequelize: MBMSequelize.instance, modelName: goodsModelName });
    GoodsCategory.init(goodsCategoryModelAttrib, { sequelize: MBMSequelize.instance, modelName: goodsCategoryModelName, indexes: [goodsCategoryAdditionalUniqueIndex] });
    GoodsOrder.init(goodsOrderModelAttrib, { sequelize: MBMSequelize.instance, modelName: goodsOrderModelName });

    /* == Model relationship setup == */
    // Account `id` <-> Booth `ownerId`
    Account.hasMany(Booth, { foreignKey: "ownerId", sourceKey: "id" });
    Booth.belongsTo(Account, { foreignKey: "ownerId", targetKey: "id" });

    // Booth `id` <-> Goods `boothId`
    Booth.hasMany(Goods, { foreignKey: "boothId", sourceKey: "id" });
    Goods.belongsTo(Booth, { foreignKey: "boothId", targetKey: "id" });

    // Booth `id` <-> Goods Category `boothId`
    Booth.hasMany(GoodsCategory, { foreignKey: "boothId", sourceKey: "id" });
    GoodsCategory.belongsTo(Booth, { foreignKey: "boothId", targetKey: "id" });

    // Booth `id` <-> Goods Order `boothId`
    Booth.hasMany(GoodsOrder, { foreignKey: "boothId", sourceKey: "id" });
    GoodsOrder.belongsTo(Booth, { foreignKey: "boothId", targetKey: "id" });

    // Goods Category `id` <-> Goods `categoryId`
    GoodsCategory.hasMany(Goods, { foreignKey: "categoryId", sourceKey: "id" });
    Goods.belongsTo(GoodsCategory, { foreignKey: "categoryId", targetKey: "id" });

    /* == Sync model == */
    await MBMSequelize.instance.sync({ alter: process.env.NODE_ENV === "development" && process.env.SEQUELIZE_ALTERDB === "true" });

    /* == End == */
    console.debug("Sequelize models are set up.");
  }

  static async setup(): Promise<boolean> {
    MBMSequelize._instance = new Sequelize(generateConfig());

    try {
      await MBMSequelize.instance.authenticate();
    } catch(error) {
      console.error("Failed to authenticate to database:", error);
      return false;
    }

    try {
      await MBMSequelize.setupModels();
    } catch(error) {
      console.error("Failed to set up Sequelize models:", error);
      return false;
    }

    return true;
  }

  static async close(): Promise<void> {
    await MBMSequelize.instance.close();
    MBMSequelize._instance = null;
  }
}
