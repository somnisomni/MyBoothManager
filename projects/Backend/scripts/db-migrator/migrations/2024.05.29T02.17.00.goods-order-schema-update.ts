/* eslint-disable arrow-body-style */

/* *** Change `totalRevenue` column type to float *** */

import { DataTypes } from "sequelize";
import GoodsOrder from "@/db/models/goods-order";
import { Migration } from "../umzug";

export const up: Migration = async ({ context }) => {
  return await context.changeColumn(GoodsOrder.name, "totalRevenue", {
    type: DataTypes.FLOAT.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  });
};

export const down: Migration = async ({ context }) => {
  return await context.changeColumn(GoodsOrder.name, "totalRevenue", {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  });
};
