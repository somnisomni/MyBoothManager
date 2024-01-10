/* eslint-disable arrow-body-style */

/* *** Fix image ID relationship(constraint) of goods combination (this was mistake) *** */

import { DataTypes } from "sequelize";
import GoodsCombination from "@/db/models/goods-combination";
import UploadStorage from "@/db/models/uploadstorage";
import { Migration } from "../umzug";

export const up: Migration = async ({ context }) => {
  ((await context.getForeignKeyReferencesForTable(GoodsCombination.name)) as Array<Record<string, string>>).forEach(async (ref) => {
    if(ref["columnName"] !== "combinationImageId") return;

    await context.removeConstraint(GoodsCombination.name, ref["constraintName"]);
  });
  
  return await context.changeColumn(GoodsCombination.name, "combinationImageId", {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    defaultValue: null,
  });
};

export const down: Migration = async ({ context }) => {
  return await context.changeColumn(GoodsCombination.name, "combinationImageId", {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: {
      model: UploadStorage.name,
      key: "id",
    },
  });
};
