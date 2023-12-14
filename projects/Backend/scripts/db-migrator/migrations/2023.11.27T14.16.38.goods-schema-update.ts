/* eslint-disable arrow-body-style */

/* *** Apply model changes made in 1bd5a32 *** */
/* *** See https://github.com/somnisomni/MyBoothManager/commit/1bd5a32c52dee3efe1a9af3c9c3239f324cbc78f *** */

import { DataTypes } from "sequelize";
import Goods from "@/db/models/goods";
import { Migration } from "../umzug";

export const up: Migration = async ({ context }) => {
  return context.addColumn(Goods.name, "stockVisibility", {
    type: DataTypes.ENUM("hide_all", "show_remaining_only", "show_all"),
    allowNull: false,
    defaultValue: "show_all",
  });
};

export const down: Migration = async ({ context }) => {
  return context.removeColumn(Goods.name, "stockVisibility");
};
