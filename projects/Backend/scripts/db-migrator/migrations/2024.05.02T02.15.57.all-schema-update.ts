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
  const goodsRemoveStatus = Promise.all([
    context.removeColumn(Goods.name, "status"),
    context.removeColumn(Goods.name, "statusReason"),
  ]);

  const goodsRenameOwnerMemberIds = context.renameColumn(Goods.name, "ownerMembersId", "ownerMemberIds");

  const boothMemberRenameImageId = context.renameColumn(BoothMember.name, "memberImageId", "avatarImageId");

  const goodsCombinationRenameImageId = context.renameColumn(GoodsCombination.name, "combinationImageId", "goodsImageId");

  const goodsOrderRenameTotalRevenue = context.renameColumn(GoodsOrder.name, "totalPrice", "totalRevenue");

  const boothRenameContentPublish = context.renameColumn(Booth.name, "statusPublishContent", "statusContentPublished");

  return await Promise.all([
    goodsRemoveStatus,
    goodsRenameOwnerMemberIds,
    boothMemberRenameImageId,
    goodsCombinationRenameImageId,
    goodsOrderRenameTotalRevenue,
    boothRenameContentPublish,
  ]);
};

export const down: Migration = async ({ context }) => {
  const boothMemberRenameImageId = context.renameColumn(BoothMember.name, "avatarImageId", "memberImageId");

  const goodsCombinationRenameImageId = context.renameColumn(GoodsCombination.name, "goodsImageId", "combinationImageId");

  const goodsOrderRenameTotalRevenue = context.renameColumn(GoodsOrder.name, "totalRevenue", "totalPrice");

  const boothRenameContentPublish = context.renameColumn(Booth.name, "statusContentPublished", "statusPublishContent");

  const goodsRenameOwnerMemberIds = context.renameColumn(Goods.name, "ownerMemberIds", "ownerMembersId");

  const goodsAddStatus = Promise.all([
    context.addColumn(Goods.name, "status", {
      type: DataTypes.ENUM("on_sale", "pause", "sold_out"),
      allowNull: false,
      defaultValue: "on_sale",
    }),
    context.addColumn(Goods.name, "statusReason", {
      type: DataTypes.STRING(1024),
      allowNull: true,
      defaultValue: null,
    }),
  ]);

  return await Promise.all([
    boothMemberRenameImageId,
    goodsCombinationRenameImageId,
    goodsOrderRenameTotalRevenue,
    boothRenameContentPublish,
    goodsRenameOwnerMemberIds,
    goodsAddStatus,
  ]);
};
