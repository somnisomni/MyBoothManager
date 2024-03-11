/* eslint-disable arrow-body-style */

/* *** Add `ownerMembersId` column into Goods model *** */

import { DataTypes } from "sequelize";
import Goods from "@/db/models/goods";
import { Migration } from "../umzug";

export const up: Migration = async ({ context }) => {
  return await context.addColumn(Goods.name, "ownerMembersId", {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  });
};

export const down: Migration = async ({ context }) => {
  return await context.removeColumn(Goods.name, "ownerMembersId");
};
