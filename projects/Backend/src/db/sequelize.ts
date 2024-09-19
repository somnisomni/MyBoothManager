import type { Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import generateConfig from "./config";
import Account from "./models/account";
import Booth from "./models/booth";
import Goods from "./models/goods";
import GoodsCategory from "./models/goods-category";
import GoodsOrder from "./models/goods-order";
import UploadStorage from "./models/uploadstorage";
import GoodsCombination from "./models/goods-combination";
import BoothMember from "./models/booth-member";
import Fair from "./models/fair";

export default class MBMSequelize {
  private static _instance: Sequelize | null = null;

  static get instance(): Sequelize {
    if(!MBMSequelize._instance) throw new Error("Sequelize instance is not initialized! You need to set-up the instance using setup() function first.");

    return MBMSequelize._instance;
  }

  private static async setupModels(): Promise<void> {
    /* == Model initialization == */
    MBMSequelize.instance.addModels([
      Account,
      Fair,
      Booth,
      BoothMember,
      Goods,
      GoodsCombination,
      GoodsCategory,
      GoodsOrder,
      UploadStorage,
    ]);

    /* == Sync model == */
    await MBMSequelize.instance.sync({
      alter: process.env.NODE_ENV === "development" && process.env.SEQUELIZE_ALTERDB === "true",
    });

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

  static async createTransaction(afterCommit?: (transaction: Transaction) => void | Promise<void>): Promise<Transaction> {
    console.info("Begin transaction");

    const transaction = await MBMSequelize.instance.transaction();
    transaction.afterCommit(async () => {
      console.info("Transaction committed");

      if(afterCommit) await afterCommit(transaction);
    });

    return transaction;
  }
}
