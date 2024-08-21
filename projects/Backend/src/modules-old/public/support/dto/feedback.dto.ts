import { FeedbackSenderType, FeedbackType, IFeedbackRequest } from "@myboothmanager/common";

export class FeedbackRequestDto implements IFeedbackRequest {
  declare senderId: number;
  declare senderName: string;
  declare senderType: FeedbackSenderType;
  declare type: FeedbackType;
  declare content: string;
}
