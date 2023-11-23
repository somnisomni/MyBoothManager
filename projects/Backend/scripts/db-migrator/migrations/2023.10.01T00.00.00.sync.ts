/* eslint-disable arrow-body-style */

import { DataTypes } from "sequelize";
import { BoothStatus, GoodsStatus } from "@myboothmanager/common";
import { accountModelName } from "@/db/models/account";
import { boothModelName } from "@/db/models/booth";
import { goodsOrderModelName } from "@/db/models/goods-order";
import { goodsCategoryModelName } from "@/db/models/goods-category";
import { goodsModelName } from "@/db/models/goods";
import { Migration } from "../umzug";

export const up: Migration = async ({ context }) => {
  /* == Model table creation == */
  const account = context.createTable(accountModelName, {
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
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });
  const booth = context.createTable(boothModelName, {
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
        model: accountModelName,
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
      type: DataTypes.ENUM(...Object.values(BoothStatus)),
      allowNull: false,
      defaultValue: BoothStatus.PREPARE,
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
  });
  const goodsCategory = context.createTable(goodsCategoryModelName, {
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
        model: boothModelName,
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
  });
  const goodsOrder = context.createTable(goodsOrderModelName, {
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
        model: boothModelName,
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
  });
  const goods = context.createTable(goodsModelName, {
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
        model: boothModelName,
        key: "id",
      },
    },
    categoryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: null,
      references: {
        model: goodsCategoryModelName,
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
      type: DataTypes.ENUM(...Object.values(GoodsStatus)),
      allowNull: false,
      defaultValue: GoodsStatus.ON_SALE,
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
  });

  /* == Relationship setup will be occured in the backend runtime == */
  /* == See @/db/sequelize.ts == */

  return Promise.all([account, booth, goodsCategory, goodsOrder, goods]);
};

export const down: Migration = async ({ context }) => {
  const account = context.dropTable(accountModelName);
  const booth = context.dropTable(boothModelName);
  const goodsCategory = context.dropTable(goodsCategoryModelName);
  const goodsOrder = context.dropTable(goodsOrderModelName);
  const goods = context.dropTable(goodsModelName);

  return Promise.all([account, booth, goodsCategory, goodsOrder, goods]);
};
