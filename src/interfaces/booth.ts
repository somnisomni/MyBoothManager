export enum BoothStatus {
  OPEN = "open",
  PAUSE = "pause",
  CLOSE = "close",
  PREPARE = "prepare",
}

export interface IBooth {
  id: number;
  ownerId: number;  // Foreign key to Account.id
  name: string;
  description?: string;
  location: string;
  currencySymbol: string;
  status: BoothStatus;
  statusReason?: string;
  statusPublishContent?: boolean;
}
export type IBoothResponse = IBooth;

export type BoothCreateRequestKey = "name" | "description" | "location" | "currencySymbol";
export type IBoothCreateRequest = Pick<IBooth, BoothCreateRequestKey>;
