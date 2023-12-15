/* eslint-disable arrow-body-style */

/* *** Change Goods.price data type to FLOAT *** */

import { DataTypes } from "sequelize";
import Goods from "@/db/models/goods";
import { Migration } from "../umzug";

export const up: Migration = async ({ context }) => {
  return await context.changeColumn(Goods.name, "price", {
    type: DataTypes.FLOAT.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  });
};

export const down: Migration = async ({ context }) => {
  return await context.changeColumn(Goods.name, "price", {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  });
};
