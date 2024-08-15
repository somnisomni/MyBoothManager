/* eslint-disable arrow-body-style */

/* *** Add `currencyCode`, `noticeContent`, `relatedLinks` in Booth model *** */

import { DataTypes } from "sequelize";
import { Migration } from "../umzug";
import Booth from "@/db/models/booth";

export const up: Migration = async ({ context }) => {
  await context.addColumn(Booth.name, "currencyCode", {
    type: DataTypes.STRING(8),
    allowNull: false,
    defaultValue: "KRW",
  });

  await context.addColumn(Booth.name, "noticeContent", {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  });

  await context.addColumn(Booth.name, "relatedLinks", {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  });
};

export const down: Migration = async ({ context }) => {
  await context.removeColumn(Booth.name, "currencyCode");
  await context.removeColumn(Booth.name, "noticeContent");
  await context.removeColumn(Booth.name, "relatedLinks");
};
