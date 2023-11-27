/* eslint-disable arrow-body-style */

/* *** Apply goods order model changes made in 12013ed *** */
/* *** See https://github.com/somnisomni/MyBoothManager/commit/12013ed6b7356e34b68e057a1cc921fae83f3b46 *** */

import GoodsOrder, { goodsOrderModelAttrib } from "@/db/models/goods-order";
import { Migration } from "../umzug";

export const up: Migration = async ({ context }) => {
  return context.addColumn(GoodsOrder.name, "status", goodsOrderModelAttrib.status);
};

export const down: Migration = async ({ context }) => {
  return context.removeColumn(GoodsOrder.name, "status");
};