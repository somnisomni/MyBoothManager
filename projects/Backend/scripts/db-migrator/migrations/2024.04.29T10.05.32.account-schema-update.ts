/* eslint-disable arrow-body-style */

/* *** Make `lastLoginAt` column nullable *** */

import { DataTypes } from "sequelize";
import { Migration } from "../umzug";
import Account from "@/db/models/account";

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
