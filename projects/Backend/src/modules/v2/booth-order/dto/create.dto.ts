import type { GoodsOrderPaymentMethod, IGoodsOrderCreateRequest, IGoodsOrderItem } from "@myboothmanager/common";

export class CreateBoothOrderRequestDto implements IGoodsOrderCreateRequest {
  declare boothId: number;
  declare order: IGoodsOrderItem[];
  declare totalRevenue: number;
  declare paymentMethod?: GoodsOrderPaymentMethod;
}
