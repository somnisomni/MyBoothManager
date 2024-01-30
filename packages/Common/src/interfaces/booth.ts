import type { IDataModelBase } from "./base";

export enum BoothStatus {
  OPEN = "open",
  PAUSE = "pause",
  CLOSE = "close",
  PREPARE = "prepare",
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
  boothNumber?: string;
  currencySymbol: string;
  expenses: Array<IBoothExpense>;  // 부대비용 (경비)
  dateOpen: Date;
  dateClose: Date;
  status: BoothStatus;
  statusReason?: string;
  statusPublishContent?: boolean;
  bannerImageUrl?: string;
  infoImageUrl?: string;  // TODO: many images
}
export type IBoothResponse = IBooth;

export interface IBoothModel extends Omit<IBooth, "bannerImageUrl" | "infoImageUrl"> {
  bannerImageId?: number | null;
  infoImageId?: number | null;  // TODO: many images
}

export type BoothCreateRequestKey = "name" | "description" | "location" | "boothNumber" | "currencySymbol" | "dateOpen" | "dateClose";
export type IBoothCreateRequest = Pick<IBooth, BoothCreateRequestKey>;

export type BoothUpdateRequestKey = "name" | "description" | "location" | "boothNumber" | "currencySymbol" | "expenses" | "dateOpen" | "dateClose";
export type IBoothUpdateRequest = Partial<Pick<IBooth, BoothUpdateRequestKey>>;

export type BoothStatusUpdateRequestKey = "status" | "statusReason" | "statusPublishContent";
export type IBoothStatusUpdateRequest = Partial<Pick<IBooth, BoothStatusUpdateRequestKey>>;
