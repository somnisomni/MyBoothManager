import { Options } from "sequelize";

export default function generateConfig(): Options {
  if(!process.env.MYSQL_HOST ||
     !process.env.MYSQL_PORT ||
     !process.env.MYSQL_USER ||
     !process.env.MYSQL_PASSWORD ||
     !process.env.MYSQL_DATABASE) {
    throw new Error("Missing crucial parameters for MySQL connection!");
  }

  const sequelizeConfig: Options = {
    dialect: "mysql",
    host: process.env.MYSQL_HOST || "localhost",
    port: Number(process.env.MYSQL_PORT) || 3306,
    username: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "myboothmanager",
    timezone: process.env.SEQUELIZE_TIMEZONE || "+09:00",
    logging: (...msg) => console.debug("[DB]", msg[0]),
    define: {
      paranoid: true,
      freezeTableName: true,
      timestamps: true,

      createdAt: "createdAt",
      updatedAt: "updatedAt",
      deletedAt: "deletedAt",
    },
  };

  return sequelizeConfig;
}
