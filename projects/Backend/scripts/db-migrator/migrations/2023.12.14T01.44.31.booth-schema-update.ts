/* eslint-disable arrow-body-style */

/* *** Apply goods order model changes made in 92d23ab *** */
/* *** See https://github.com/somnisomni/MyBoothManager/commit/92d23ab9e47461385ea95b54ad89b8a2b0dddee9 *** */

import { DataTypes } from "sequelize";
import Booth from "@/db/models/booth";
import { Migration } from "../umzug";

export const up: Migration = async ({ context }) => {
  return await context.addColumn(Booth.name, "bannerImageId", {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    defaultValue: null,
  });
};

export const down: Migration = async ({ context }) => {
  return await context.removeColumn(Booth.name, "bannerImageId");
};
