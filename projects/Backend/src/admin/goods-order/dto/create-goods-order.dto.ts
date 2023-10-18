import { IGoodsOrderCreateRequest, IGoodsOrderDetailItem } from "@myboothmanager/common";

export class CreateGoodsOrderDTO implements IGoodsOrderCreateRequest {
  boothId!: number;
  order!: Array<IGoodsOrderDetailItem>;
  totalPrice!: number;
}
