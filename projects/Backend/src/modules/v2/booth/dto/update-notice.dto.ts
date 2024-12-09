import { type IBoothNoticeUpdateRequest } from "@myboothmanager/common";

export class UpdateBoothNoticeRequestDto implements IBoothNoticeUpdateRequest {
  declare noticeContent?: string | null;
}
