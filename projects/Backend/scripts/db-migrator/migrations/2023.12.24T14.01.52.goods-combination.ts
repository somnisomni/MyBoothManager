/* eslint-disable arrow-body-style */

/* *** New table `GoodsCombination` created & Add `combinationId` to Goods model *** */

import { DataTypes } from "sequelize";
import GoodsCombination from "@/db/models/goods-combination";
import Goods from "@/db/models/goods";
import Booth from "@/db/models/booth";
import GoodsCategory from "@/db/models/goods-category";
import UploadStorage from "@/db/models/uploadstorage";
import { Migration, SEQUELIZE_TIMESTAMP_ATTRIBUTES } from "../umzug";

export const up: Migration = async ({ context }) => {
  const goods = context.addColumn(Goods.name, "combinationId", {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: {
      model: GoodsCombination.name,
      key: "id",
    },
  });
  const combination = context.createTable(GoodsCombination.name, {
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
    },
    price: {
      type: DataTypes.FLOAT.UNSIGNED,
      allowNull: false,
    },
    stockVisibility: {
      type: DataTypes.ENUM("hide_all", "show_remaining_only", "show_all"),
      allowNull: false,
      defaultValue: "show_all",
    },
    combinationImageId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: UploadStorage.name,
        key: "id",
      },
    },
    ...SEQUELIZE_TIMESTAMP_ATTRIBUTES,
  });

  return Promise.all([goods, combination]);
};

export const down: Migration = async ({ context }) => {
  const goods = context.removeColumn(Goods.name, "combinationId");
  const combination = context.dropTable(GoodsCombination.name);

  return Promise.all([goods, combination]);
};
