import type { IDataModelBase } from "./base";

export enum BoothStatus {
  OPEN = "open",
  PAUSE = "pause",
  CLOSE = "close",
  PREPARE = "prepare",
}

export interface IBoothMember extends IDataModelBase {
  name: string;
  descriptionShort?: string;
  role: string;
  primaryColor: string;
  url?: string;
}

export interface IBoothExpense extends IDataModelBase {
  name: string;
  price: number;
}

export interface IBooth extends IDataModelBase {
  id: number;
  ownerId: number;  // Foreign key to Account.id
  name: string;
  description?: string;
  location: string;
  currencySymbol: string;
  members: Array<IBoothMember>;
  expenses: Array<IBoothExpense>;  // 부대비용 (경비)
  dateOpen: Date;
  dateClose: Date;
  status: BoothStatus;
  statusReason?: string;
  statusPublishContent?: boolean;
}
export type IBoothResponse = IBooth;

export type BoothCreateRequestKey = "name" | "description" | "location" | "currencySymbol" | "dateOpen" | "dateClose";
export type IBoothCreateRequest = Pick<IBooth, BoothCreateRequestKey>;

export type BoothUpdateRequestKey = "name" | "description" | "location" | "currencySymbol" | "members" | "expenses" | "dateOpen" | "dateClose";
export type IBoothUpdateRequest = Partial<Pick<IBooth, BoothUpdateRequestKey>>;

export type BoothStatusUpdateRequestKey = "status" | "statusReason" | "statusPublishContent";
export type IBoothStatusUpdateRequest = Partial<Pick<IBooth, BoothStatusUpdateRequestKey>>;
