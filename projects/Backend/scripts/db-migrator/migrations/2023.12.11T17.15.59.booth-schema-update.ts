/* eslint-disable arrow-body-style */

/* *** Apply model changes made in 991f74b *** */
/* *** See https://github.com/somnisomni/MyBoothManager/commit/991f74b534b98988a2ecdb82de7fe7af63584a3c *** */

import { DataTypes } from "sequelize";
import Booth from "@/db/models/booth";
import { Migration } from "../umzug";

export const up: Migration = async ({ context }) => {
  return await context.addColumn(Booth.name, "boothNumber", {
    type: DataTypes.STRING(16),
    allowNull: true,
    defaultValue: null,
  });
};

export const down: Migration = async ({ context }) => {
  return await context.removeColumn(Booth.name, "boothNumber");
};
