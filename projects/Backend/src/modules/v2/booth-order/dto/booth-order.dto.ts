import { GoodsOrderPaymentMethod, GoodsOrderStatus, IGoodsOrderItem, IGoodsOrderResponse } from "@myboothmanager/common";
import deepClone from "clone-deep";
import GoodsOrder from "@/db/models/goods-order";

export class BoothOrderResponseDto implements IGoodsOrderResponse {
  declare id: number;
  declare boothId: number;
  declare order: Array<IGoodsOrderItem>;
  declare totalRevenue: number;
  declare paymentMethod?: GoodsOrderPaymentMethod;
  declare status: GoodsOrderStatus;
  declare createdAt: Date;

  constructor(model: GoodsOrder) {
    const values = model.get();

    this.id = values.id;
    this.boothId = values.boothId;
    this.order = deepClone(values.order);
    this.totalRevenue = values.totalRevenue;
    this.paymentMethod = values.paymentMethod;
    this.status = values.status;
    this.createdAt = new Date(model.createdAt);
  }
}
