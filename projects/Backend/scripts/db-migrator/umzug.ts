import { DataTypes, ModelAttributes, QueryInterface, Sequelize } from "sequelize";
import { SequelizeStorage, Umzug } from "umzug";
import generateConfig from "@/db/config";

const sequelize: Sequelize = new Sequelize(generateConfig());
const migGlob = process.env.NODE_ENV === "development" ? "./migrations/*.ts" : "./migrations/*.js";

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
  storage: new SequelizeStorage({ sequelize }),
  context: sequelize.getQueryInterface(),
  migrations: {
    glob: [ migGlob, { cwd: __dirname } ],
  },
  logger: console,
});

export type Migration = typeof migrator._types.migration;
