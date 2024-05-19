import { BoothStatus, IBoothStatusUpdateRequest } from "@myboothmanager/common";

export class UpdateBoothStatusRequestDto implements IBoothStatusUpdateRequest {
  declare status: BoothStatus;
  declare reason?: string;
  declare contentPublished?: boolean;
}
