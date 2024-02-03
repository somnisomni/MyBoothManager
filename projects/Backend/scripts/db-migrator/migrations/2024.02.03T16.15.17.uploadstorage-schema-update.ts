/* eslint-disable arrow-body-style */

/* *** New column `extensions` and `imageThumbnailBase64` to UploadStorage model *** */

import { DataTypes } from "sequelize";
import UploadStorage from "@/db/models/uploadstorage";
import { Migration } from "../umzug";

export const up: Migration = async ({ context }) => {
  return Promise.all([
    context.addColumn(UploadStorage.name, "extensions", {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    }),
    context.addColumn(UploadStorage.name, "imageThumbnailBase64", {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    }),
  ]);
};

export const down: Migration = async ({ context }) => {
  return Promise.all([
    context.removeColumn(UploadStorage.name, "extensions"),
    context.removeColumn(UploadStorage.name, "imageThumbnailBase64"),
  ]);
};
