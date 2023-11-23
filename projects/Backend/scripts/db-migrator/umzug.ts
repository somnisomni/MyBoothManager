import { QueryInterface, Sequelize } from "sequelize";
import { SequelizeStorage, Umzug } from "umzug";
import generateConfig from "@/db/config";

const sequelize: Sequelize = new Sequelize(generateConfig());

const migGlob = process.env.NODE_ENV === "development" ? "./migrations/*.ts" : "./migrations/*.js";
export const migrator: Umzug<QueryInterface> = new Umzug({
  storage: new SequelizeStorage({ sequelize }),
  context: sequelize.getQueryInterface(),
  migrations: {
    glob: [ migGlob, { cwd: __dirname } ],
  },
  logger: console,
});

export type Migration = typeof migrator._types.migration;
