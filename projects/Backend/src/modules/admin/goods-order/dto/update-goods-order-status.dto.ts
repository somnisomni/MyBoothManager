import { GoodsOrderStatus, IGoodsOrderStatusUpdateRequest } from "@myboothmanager/common";

export class UpdateGoodsOrderStatusDTO implements IGoodsOrderStatusUpdateRequest {
  status!: GoodsOrderStatus;
}
