export const enum FeedbackSenderType {
  BOOTH_ADMIN = "Booth Admin",
  PUBLIC_USER = "Public User",
}

export const enum FeedbackType {
  FEATURE_REQUEST = "Feature Request",
  FAIR_REQUEST = "Fair Registration Request",
  BUG_ISSUES = "Bug & Issues",
  OTHER = "Other",
}

export interface IFeedbackRequest {
  senderId: number;
  senderName: string;
  senderType: FeedbackSenderType;
  type: FeedbackType;
  content: string;
}
