import { BoothStatus, IBoothStatusUpdateRequest } from "@myboothmanager/common";

export class UpdateBoothStatusRequestDto implements IBoothStatusUpdateRequest {
  declare status: BoothStatus;
  declare statusReason?: string;
  declare statusPublishContent?: boolean;
}
