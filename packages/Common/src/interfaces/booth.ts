import type { IDataModelBase } from "./base";

export enum BoothStatus {
  OPEN = "open",
  PAUSE = "pause",
  CLOSE = "close",
  PREPARE = "prepare",
}

export interface IBooth extends IDataModelBase {
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

// Currently BoothCreate and BoothUpdate are identical, but have different name for future extensibility
export type BoothUpdateRequestKey = "name" | "description" | "location" | "currencySymbol";
export type IBoothUpdateReuqest = Partial<Pick<IBooth, BoothUpdateRequestKey>>;

export type BoothStatusUpdateRequestKey = "status" | "statusReason" | "statusPublishContent";
export type IBoothStatusUpdateRequest = Partial<Pick<IBooth, BoothStatusUpdateRequestKey>>;
