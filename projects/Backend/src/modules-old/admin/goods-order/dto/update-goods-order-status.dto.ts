import { GoodsOrderStatus, IGoodsOrderStatusUpdateRequest } from "@myboothmanager/common";

export class UpdateGoodsOrderStatusRequestDto implements IGoodsOrderStatusUpdateRequest {
  declare status: GoodsOrderStatus;
}
