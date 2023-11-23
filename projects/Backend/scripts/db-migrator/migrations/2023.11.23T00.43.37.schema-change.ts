/* eslint-disable arrow-body-style */

import GoodsOrder, { goodsOrderModelAttrib } from "@/db/models/goods-order";
import { Migration } from "../umzug";

export const up: Migration = async ({ context }) => {
  return context.addColumn(GoodsOrder.name, "status", goodsOrderModelAttrib.status);
};

export const down: Migration = async ({ context }) => {
  return context.removeColumn(GoodsOrder.name, "status");
};
