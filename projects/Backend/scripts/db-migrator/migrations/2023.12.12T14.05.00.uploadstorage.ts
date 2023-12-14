/* eslint-disable arrow-body-style */

/* *** New table created in 46beffa *** */
/* *** See https://github.com/somnisomni/MyBoothManager/commit/46beffa949180f1c8a1e5814d29115d93cbaed0d *** */

import { DataTypes } from "sequelize";
import UploadStorage from "@/db/models/uploadstorage";
import { Migration } from "../umzug";

export const up: Migration = async ({ context }) => {
  return await context.createTable(UploadStorage.name, {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    ownerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    savePath: {
      type: DataTypes.STRING(32),
      allowNull: true,
      defaultValue: "/",
    },
    fileName: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
  });
};

export const down: Migration = async ({ context }) => {
  return await context.dropTable(UploadStorage.name);
};
