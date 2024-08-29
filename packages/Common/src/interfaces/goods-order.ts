// NOTE: Admin-only interfaces (goods order is admin-only feature)

import { MutualExclusive } from "..";

/* === Common === */
interface IGoodsOrderCommon {
  id: number;
  boothId: number;
  order: Array<IGoodsOrderItem>;
  status: GoodsOrderStatus;
  totalRevenue: number;
  paymentMethod?: GoodsOrderPaymentMethod;

  // Use sequelize's autogenerated timestamp
  createdAt?: Date;
}

interface IGoodsOrderItemBase {
  gId: number;
  cId: number;
  name: string;
  quantity: number;
  price?: number | null;
  combinedGoods?: Array<Omit<IGoodsOrderItem, "cId" | "combinedGoods" | "quantity">>;
}
export type IGoodsOrderItem = MutualExclusive<IGoodsOrderItemBase, "gId", "cId" | "combinedGoods">;

/* === Enums === */
export enum GoodsOrderStatus {
  RECORDED = "recorded",
  CANCELED = "canceled",
}

export enum GoodsOrderPaymentMethod {
  CASH = "cash",
  TRANSFER = "transfer",
  PREPAID = "prepaid",
  CARD = "card",
}

/* === Frontend === */
export interface IGoodsOrder extends IGoodsOrderCommon { }

/* === Model for Backend (DB) === */
export interface IGoodsOrderModel extends IGoodsOrderCommon { }

/* === Requests === */
export interface IGoodsOrderCreateRequest extends Omit<IGoodsOrderCommon, "id" | "status" | "createdAt"> { }
export interface IGoodsOrderStatusUpdateRequest extends Pick<IGoodsOrderCommon, "status"> { }

/* === Responses === */
export interface IGoodsOrderResponse extends IGoodsOrderCommon { }
