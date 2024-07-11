/* eslint-disable arrow-body-style */

/* *** New table `Fair` and add some columns to `Booth` table *** */

import { DataTypes } from "sequelize";
import Fair from "@/db/models/fair";
import Booth from "@/db/models/booth";
import { Migration, SEQUELIZE_TIMESTAMP_ATTRIBUTES } from "../umzug";

export const up: Migration = async ({ context }) => {
  // Create table
  await context.createTable(Fair.name, {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      defaultValue: null,
    },
    location: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    openingDates: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    websiteUrl: {
      type: DataTypes.STRING(512),
      allowNull: true,
      defaultValue: null,
    },
    ...SEQUELIZE_TIMESTAMP_ATTRIBUTES,
  });

  // Update booth table
  await context.addColumn(Booth.name, "fairId", {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    defaultValue: null,
    references: {
      model: Fair.name,
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  });

  await context.addColumn(Booth.name, "datesOpenInFair", {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null,
  });
};

export const down: Migration = async ({ context }) => {
  await context.removeColumn(Booth.name, "datesOpenInFair");
  await context.removeColumn(Booth.name, "fairId");
  await context.dropTable(Fair.name);
};
