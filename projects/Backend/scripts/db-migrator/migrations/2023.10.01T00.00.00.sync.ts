/* *** First-time database table synchronization *** */
/* ***       apply changes before commit 12013ed *** */
/* *** Timestamp of this file is bogus; not reflects actual time of change *** */

import { DataTypes } from "sequelize";
import Account from "@/db/models/account";
import Booth from "@/db/models/booth";
import GoodsOrder from "@/db/models/goods-order";
import GoodsCategory from "@/db/models/goods-category";
import Goods from "@/db/models/goods";
import { Migration, SEQUELIZE_TIMESTAMP_ATTRIBUTES } from "../umzug";

export const up: Migration = async ({ context }) => {
  /* == Model table creation == */
  const account = context.createTable(Account.name, {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    loginId: {
      type: DataTypes.STRING(256),
      allowNull: false,
      unique: true,
    },
    loginPassHash: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    loginCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    ...SEQUELIZE_TIMESTAMP_ATTRIBUTES,
  });
  const booth = context.createTable(Booth.name, {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    ownerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Account.name,
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      defaultValue: null,
    },
    location: {
      type: DataTypes.STRING(512),
      allowNull: false,
    },
    currencySymbol: {
      type: DataTypes.STRING(8),
      allowNull: false,
      defaultValue: "₩",
    },
    status: {
      type: DataTypes.ENUM("open", "pause", "close", "prepare"),
      allowNull: false,
      defaultValue: "prepare",
    },
    statusReason: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      defaultValue: null,
    },
    statusPublishContent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    ...SEQUELIZE_TIMESTAMP_ATTRIBUTES,
  });
  const goodsCategory = context.createTable(GoodsCategory.name, {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    boothId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Booth.name,
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    ...SEQUELIZE_TIMESTAMP_ATTRIBUTES,
  });
  const goodsOrder = context.createTable(GoodsOrder.name, {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    boothId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Booth.name,
        key: "id",
      },
    },
    order: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    ...SEQUELIZE_TIMESTAMP_ATTRIBUTES,
  });
  const goods = context.createTable(Goods.name, {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    boothId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Booth.name,
        key: "id",
      },
    },
    categoryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: null,
      references: {
        model: GoodsCategory.name,
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      defaultValue: null,
    },
    type: {
      type: DataTypes.STRING(128),
      allowNull: true,
      defaultValue: null,
    },
    status: {
      type: DataTypes.ENUM("on_sale", "pause", "sold_out"),
      allowNull: false,
      defaultValue: "on_sale",
    },
    statusReason: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      defaultValue: null,
    },
    price: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    stockInitial: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    stockRemaining: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    ...SEQUELIZE_TIMESTAMP_ATTRIBUTES,
  });

  /* == Relationship setup will be occured in the backend runtime == */
  /* == See @/db/sequelize.ts == */

  return Promise.all([account, booth, goodsCategory, goodsOrder, goods]);
};

export const down: Migration = async ({ context }) => {
  const account = context.dropTable(Account.name);
  const booth = context.dropTable(Booth.name);
  const goodsCategory = context.dropTable(GoodsCategory.name);
  const goodsOrder = context.dropTable(GoodsOrder.name);
  const goods = context.dropTable(Goods.name);

  return Promise.all([account, booth, goodsCategory, goodsOrder, goods]);
};
