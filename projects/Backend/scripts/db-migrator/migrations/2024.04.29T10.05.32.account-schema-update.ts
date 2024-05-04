/* eslint-disable arrow-body-style */

/* *** Make `lastLoginAt` column nullable *** */

import { DataTypes } from "sequelize";
import Account from "@/db/models/account";
import { Migration } from "../umzug";

export const up: Migration = async ({ context }) => {
  return await context.changeColumn(Account.name, "lastLoginAt", {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  });
};

export const down: Migration = async ({ context }) => {
  return await context.changeColumn(Account.name, "lastLoginAt", {
    type: DataTypes.DATE,
    allowNull: false,
  });
};
