/* eslint-disable arrow-body-style */

/* *** Apply model changes made in baaf167 *** */
/* *** See https://github.com/somnisomni/MyBoothManager/commit/baaf167fb5124ff4eff6605e822559050f956f34 *** */

import { DataTypes } from "sequelize";
import Goods from "@/db/models/goods";
import { Migration } from "../umzug";

export const up: Migration = async ({ context }) => {
  return await context.addColumn(Goods.name, "goodsImageId", {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    defaultValue: null,
  });
};

export const down: Migration = async ({ context }) => {
  return await context.removeColumn(Goods.name, "goodsImageId");
};
