/* eslint-disable arrow-body-style */

/* *** Apply model changes made in c58d7be *** */
/* *** See https://github.com/somnisomni/MyBoothManager/commit/c58d7be467346b1590603eca4c24a71c9d560365 *** */

import { DataTypes } from "sequelize";
import Booth from "@/db/models/booth";
import { Migration } from "../umzug";

export const up: Migration = async ({ context }) => {
  const members = context.addColumn(Booth.name, "members", {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  });
  const expenses = context.addColumn(Booth.name, "expenses", {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  });
  const dateOpen = context.addColumn(Booth.name, "dateOpen", {
    type: DataTypes.DATEONLY,
  });
  const dateClose = context.addColumn(Booth.name, "dateClose", {
    type: DataTypes.DATEONLY,
  });

  await Promise.all([members, expenses, dateOpen, dateClose]);
};

export const down: Migration = async ({ context }) => {
  const members = context.removeColumn(Booth.name, "members");
  const expenses = context.removeColumn(Booth.name, "expenses");
  const dateOpen = context.removeColumn(Booth.name, "dateOpen");
  const dateClose = context.removeColumn(Booth.name, "dateClose");

  await Promise.all([members, expenses, dateOpen, dateClose]);
};
