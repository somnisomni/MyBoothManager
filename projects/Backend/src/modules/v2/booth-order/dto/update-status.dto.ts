import { GoodsOrderStatus, IGoodsOrderStatusUpdateRequest } from "@myboothmanager/common";

export class UpdateBoothOrderStatusRequestDto implements IGoodsOrderStatusUpdateRequest {
  declare status: GoodsOrderStatus;
}
