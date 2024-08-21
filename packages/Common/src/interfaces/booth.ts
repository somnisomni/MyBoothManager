import { SupportedCurrencyCodes } from "@/utils/currency";
import { IFairInfo, IImageUploadInfo } from "./base";

/* === Common === */
interface IBoothCommon {
  id: number;
  ownerId: number;
  fairId?: number | null;
  name: string;
  /** @deprecated Use `currencyCode` instead. */ currencySymbol: string;
  currencyCode: SupportedCurrencyCodes;
  description?: string | null;
  noticeContent?: string | null;
  boothNumber?: string | null;
  status: IBoothStatus;
  location?: string | null; // For custom fair
  dateOpen?: Date | null;   // For custom fair
  dateClose?: Date | null;  // For custom fair
  datesOpenInFair?: Array<Date> | null;  // Only with fair
  relatedLinks?: Array<IBoothRelatedLink>;
}

export interface IBoothStatus {
  status: BoothStatus;
  reason?: string;
  contentPublished?: boolean;
}

export interface IBoothExpense {
  name: string;
  price: number;
}

export interface IBoothRelatedLink {
  title: string;
  url: string;
}

/* === Enums === */
export enum BoothStatus {
  OPEN = "open",
  PAUSE = "pause",
  CLOSE = "close",
  PREPARE = "prepare",
}

/* === Frontend === */
export interface IBooth extends Omit<IBoothCommon, "fairId"> {
  fair?: IFairInfo | null;
  bannerImage?: IImageUploadInfo | null;
  infoImage?: IImageUploadInfo | null;
}

export interface IBoothAdmin extends IBooth {
  expenses: Array<IBoothExpense>;
}

/* === Model for Backend (DB) === */
export interface IBoothModel extends Omit<IBoothCommon, "datesOpenInFair" | "status"> {
  datesOpenInFair?: Array<string> | null;   // JSON string array of "YYYY-MM-DD"
  status: BoothStatus;
  statusReason?: string | null;
  statusContentPublished: boolean;
  expenses: Array<IBoothExpense>;
  bannerImageId?: number | null;
  infoImageId?: number | null;
}

/* === Requests === */
export type IBoothCreateRequest = Omit<IBoothCommon, "id" | "ownerId" | "noticeContent" | "status" | "datesOpenInFair" | "relatedLinks">;
export type IBoothCreateWithFairRequest = Omit<IBoothCommon, "id" | "ownerId" | "noticeContent" | "status" | "location" | "dateOpen" | "dateClose" | "relatedLinks">;
export type IBoothUpdateRequest = Partial<Omit<IBoothCommon, "id" | "ownerId" | "fairId" | "status" | "currencySymbol" | "currencyCode">>;
export type IBoothNoticeUpdateRequest = Pick<IBoothCommon, "noticeContent">;
export type IBoothStatusUpdateRequest = Partial<IBoothStatus>;

/* === Responses === */
export type IBoothResponse = Omit<IBooth, "fairId">;
export type IBoothAdminResponse = IBoothAdmin;
