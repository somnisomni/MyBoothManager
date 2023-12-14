import type { IDataModelBase } from "./base";

export enum BoothStatus {
  OPEN = "open",
  PAUSE = "pause",
  CLOSE = "close",
  PREPARE = "prepare",
}

export interface IBoothMember extends IDataModelBase {
  uuid: string;
  name: string;
  descriptionShort?: string;
  role: string;
  primaryColor: string;
  url?: string;
}
export type IBoothMemberAddRequest = Omit<IBoothMember, "uuid"> & { boothId: number };
export type IBoothMemberRemoveRequest = Pick<IBoothMember, "uuid"> & { boothId: number };
export type IBoothMemberManipulationResponse = { boothId: number, members: Array<IBoothMember> };

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
  members: Array<IBoothMember>;
  expenses: Array<IBoothExpense>;  // 부대비용 (경비)
  dateOpen: Date;
  dateClose: Date;
  status: BoothStatus;
  statusReason?: string;
  statusPublishContent?: boolean;
  bannerImageUrl?: string;
}
export type IBoothResponse = IBooth;

export interface IBoothModel extends Omit<IBooth, "bannerImageUrl"> {
  bannerImageId?: number;
}

export type BoothCreateRequestKey = "name" | "description" | "location" | "boothNumber" | "currencySymbol" | "dateOpen" | "dateClose";
export type IBoothCreateRequest = Pick<IBooth, BoothCreateRequestKey>;

export type BoothUpdateRequestKey = "name" | "description" | "location" | "boothNumber" | "currencySymbol" | "expenses" | "dateOpen" | "dateClose";
export type IBoothUpdateRequest = Partial<Pick<IBooth, BoothUpdateRequestKey>>;

export type BoothStatusUpdateRequestKey = "status" | "statusReason" | "statusPublishContent";
export type IBoothStatusUpdateRequest = Partial<Pick<IBooth, BoothStatusUpdateRequestKey>>;
