import { DataTypes, ModelAttributes, QueryInterface } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { SequelizeStorage, Umzug } from "umzug";
import generateConfig from "@/db/config";
import Account from "@/db/models/account";
import Booth from "@/db/models/booth";
import BoothMember from "@/db/models/booth-member";
import Fair from "@/db/models/fair";
import Goods from "@/db/models/goods";
import GoodsCategory from "@/db/models/goods-category";
import GoodsCombination from "@/db/models/goods-combination";
import GoodsOrder from "@/db/models/goods-order";
import UploadStorage from "@/db/models/uploadstorage";

const sequelize: Sequelize = new Sequelize(generateConfig());
sequelize.addModels([Account, Fair, Booth, BoothMember, Goods, GoodsCategory, GoodsOrder, GoodsCombination, UploadStorage]);
const migGlob  = process.env.NODE_ENV === "development" ? "./migrations/*.ts" : "./migrations/*.js";
const seedGlob = process.env.NODE_ENV === "development" ? "./seeders/*.ts" : "./seeders/*.js";

/**
 * Column attributes for Sequelize timestamps. INSERT THIS WHEN CREATING A TABLE!!!! IMPORTANT!!!!!!
 */
export const SEQUELIZE_TIMESTAMP_ATTRIBUTES: ModelAttributes = {
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
};

export const migrator: Umzug<QueryInterface> = new Umzug({
  storage: new SequelizeStorage({ sequelize, modelName: "SequelizeMeta" }),
  context: sequelize.getQueryInterface(),
  migrations: {
    glob: [ migGlob, { cwd: __dirname } ],
  },
  logger: console,
});

export type Migration = typeof migrator._types.migration;

export const seeder: Umzug<QueryInterface> = new Umzug({
  storage: new SequelizeStorage({ sequelize, modelName: "SequelizeSeedMeta" }),
  context: sequelize.getQueryInterface(),
  migrations: {
    glob: [ seedGlob, { cwd: __dirname } ],
  },
  logger: console,
});

export type Seeder = typeof seeder._types.migration;
