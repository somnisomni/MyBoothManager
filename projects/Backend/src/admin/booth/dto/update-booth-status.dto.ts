import { BoothStatus, IBoothStatusUpdateRequest } from "@myboothmanager/common";

export class UpdateBoothStatusDTO implements IBoothStatusUpdateRequest {
  status!: BoothStatus;
  statusReason?: string;
  statusPublishContent?: boolean;
}
