/* eslint-disable arrow-body-style */

/* *** Add `lastSelectedBoothId` column into Account model *** */

import { DataTypes } from "sequelize";
import Account from "@/db/models/account";
import { Migration } from "../umzug";

export const up: Migration = async ({ context }) => {
  return await context.addColumn(Account.name, "lastSelectedBoothId", {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    defaultValue: null,
  });
};

export const down: Migration = async ({ context }) => {
  return await context.removeColumn(Account.name, "lastSelectedBoothId");
};
