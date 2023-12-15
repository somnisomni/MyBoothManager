/* eslint-disable arrow-body-style */

/* *** Apply model changes made in 5b09b07 *** */
/* *** See https://github.com/somnisomni/MyBoothManager/commit/5b09b07cd6cc9f48e07d95ee07f58f81dc985694 *** */

import { DataTypes } from "sequelize";
import Booth from "@/db/models/booth";
import { Migration } from "../umzug";

export const up: Migration = async ({ context }) => {
  return await context.addColumn(Booth.name, "infoImageId", {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    defaultValue: null,
  });
};

export const down: Migration = async ({ context }) => {
  return await context.removeColumn(Booth.name, "infoImageId");
};
