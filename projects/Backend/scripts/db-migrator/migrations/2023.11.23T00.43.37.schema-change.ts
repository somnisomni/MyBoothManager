/* eslint-disable arrow-body-style */

/* *** Apply model changes made in 12013ed *** */
/* *** See https://github.com/somnisomni/MyBoothManager/commit/12013ed6b7356e34b68e057a1cc921fae83f3b46 *** */

import { DataTypes } from "sequelize";
import GoodsOrder from "@/db/models/goods-order";
import { Migration } from "../umzug";

export const up: Migration = async ({ context }) => {
  return context.addColumn(GoodsOrder.name, "status", {
    type: DataTypes.ENUM("recorded", "canceled"),
    allowNull: false,
    defaultValue: "recorded",
  });
};

export const down: Migration = async ({ context }) => {
  return context.removeColumn(GoodsOrder.name, "status");
};
