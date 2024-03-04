/* eslint-disable arrow-body-style */

/* *** Add `paymentMethod` column into GoodsOrder model *** */

import { DataTypes } from "sequelize";
import GoodsOrder from "@/db/models/goods-order";
import { Migration } from "../umzug";

export const up: Migration = async ({ context }) => {
  return await context.addColumn(GoodsOrder.name, "paymentMethod", {
    type: DataTypes.ENUM("cash", "card", "transfer", "prepaid"),
    allowNull: true,
    defaultValue: "cash",
  });
};

export const down: Migration = async ({ context }) => {
  return await context.removeColumn(GoodsOrder.name, "paymentMethod");
};
