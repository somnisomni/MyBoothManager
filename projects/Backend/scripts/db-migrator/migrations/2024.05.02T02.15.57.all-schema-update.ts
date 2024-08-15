/* eslint-disable arrow-body-style */

/* *** Apply changes made by common interfaces cleanup *** */

import { DataTypes } from "sequelize";
import Goods from "@/db/models/goods";
import BoothMember from "@/db/models/booth-member";
import GoodsCombination from "@/db/models/goods-combination";
import GoodsOrder from "@/db/models/goods-order";
import Booth from "@/db/models/booth";
import { Migration } from "../umzug";

export const up: Migration = async ({ context }) => {
  // Remove status from Goods
  await context.removeColumn(Goods.name, "status");
  await context.removeColumn(Goods.name, "statusReason");

  // Rename owner member IDs column in Goods
  await context.renameColumn(Goods.name, "ownerMembersId", "ownerMemberIds");

  // Change default stock visibility of Goods and GoodsCombination
  await context.changeColumn(Goods.name, "stockVisibility", {
    type: DataTypes.ENUM("hide_all", "show_remaining_only", "show_all"),
    allowNull: false,
    defaultValue: "show_remaining_only",
  });
  await context.changeColumn(GoodsCombination.name, "stockVisibility", {
    type: DataTypes.ENUM("hide_all", "show_remaining_only", "show_all"),
    allowNull: false,
    defaultValue: "show_remaining_only",
  });

  // Rename image ID column in BoothMember
  await context.renameColumn(BoothMember.name, "memberImageId", "avatarImageId");

  // Rename image ID column in GoodsCombination
  await context.renameColumn(GoodsCombination.name, "combinationImageId", "goodsImageId");

  // Rename total revenue column in GoodsOrder
  await context.renameColumn(GoodsOrder.name, "totalPrice", "totalRevenue");

  // Rename content publish status column in Booth
  await context.renameColumn(Booth.name, "statusPublishContent", "statusContentPublished");

  // Make location nullable in Booth
  await context.changeColumn(Booth.name, "location", {
    type: DataTypes.STRING(512),
    allowNull: true,
    defaultValue: null,
  });

  // Increase booth number length in Booth
  await context.changeColumn(Booth.name, "boothNumber", {
    type: DataTypes.STRING(32),
    allowNull: true,
    defaultValue: null,
  });

  // Make open/close date column nullable in Booth
  await context.changeColumn(Booth.name, "dateOpen", {
    type: DataTypes.DATEONLY,
    allowNull: true,
    defaultValue: null,
  });
  await context.changeColumn(Booth.name, "dateClose", {
    type: DataTypes.DATEONLY,
    allowNull: true,
    defaultValue: null,
  });
};

export const down: Migration = async ({ context }) => {
  await context.addColumn(Goods.name, "status", {
    type: DataTypes.ENUM("on_sale", "pause", "sold_out"),
    allowNull: false,
    defaultValue: "on_sale",
  });
  await context.addColumn(Goods.name, "statusReason", {
    type: DataTypes.STRING(1024),
    allowNull: true,
    defaultValue: null,
  });

  await context.renameColumn(Goods.name, "ownerMemberIds", "ownerMembersId");

  await context.changeColumn(Goods.name, "stockVisibility", {
    type: DataTypes.ENUM("hide_all", "show_remaining_only", "show_all"),
    allowNull: false,
    defaultValue: "show_all",
  });
  await context.changeColumn(GoodsCombination.name, "stockVisibility", {
    type: DataTypes.ENUM("hide_all", "show_remaining_only", "show_all"),
    allowNull: false,
    defaultValue: "show_all",
  });

  await context.renameColumn(Booth.name, "statusContentPublished", "statusPublishContent");

  await context.renameColumn(GoodsOrder.name, "totalRevenue", "totalPrice");

  await context.renameColumn(GoodsCombination.name, "goodsImageId", "combinationImageId");

  await context.renameColumn(BoothMember.name, "avatarImageId", "memberImageId");

  await context.changeColumn(Booth.name, "location", {
    type: DataTypes.STRING(512),
    allowNull: false,
  });

  await context.changeColumn(Booth.name, "boothNumber", {
    type: DataTypes.STRING(16),
    allowNull: true,
    defaultValue: null,
  });

  await context.changeColumn(Booth.name, "dateOpen", {
    type: DataTypes.DATEONLY,
    allowNull: false,
  });
  await context.changeColumn(Booth.name, "dateClose", {
    type: DataTypes.DATEONLY,
    allowNull: false,
  });
};
