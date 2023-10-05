import { IGoodsOrderCreateRequest } from "@myboothmanager/common";

export class CreateGoodsOrderDTO implements IGoodsOrderCreateRequest {
  boothId!: number;
  order!: { gId: number; quantity: number; }[];
  totalPrice!: number;
}
