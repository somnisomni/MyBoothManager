/* eslint-disable arrow-body-style */

/* *** New table `BoothMember` created & Remove `members` column from Booth table *** */

import { DataTypes } from "sequelize";
import Booth from "@/db/models/booth";
import BoothMember from "@/db/models/booth-member";
import { Migration, SEQUELIZE_TIMESTAMP_ATTRIBUTES } from "../umzug";

export const up: Migration = async ({ context }) => {
  const boothMember = context.createTable(BoothMember.name, {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    boothId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Booth.name,
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    descriptionShort: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    primaryColor: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    memberImageId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    ...SEQUELIZE_TIMESTAMP_ATTRIBUTES,
  });
  const booth = context.removeColumn(Booth.name, "members");

  return Promise.all([boothMember, booth]);
};

export const down: Migration = async ({ context }) => {
  const booth = context.addColumn(Booth.name, "members", {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  });
  const boothMember = context.dropTable(BoothMember.name);

  return Promise.all([booth, boothMember]);
};
