/* eslint-disable @typescript-eslint/no-empty-object-type */

import type { IFairInfo, IImageUploadInfo } from "./base";
import type { SupportedCurrencyCodes } from "@/utils/currency";

/* === Common === */
interface IBoothCommon {
  id: number;
  ownerId: number;
  fairId?: number | null;
  name: string;
  currencyCode: SupportedCurrencyCodes;
  description?: string | null;
  noticeContent?: string | null;
  boothNumber?: string | null;
  status: IBoothStatus;
  location?: string | null; // For custom fair
  dateOpen?: Date | null;   // For custom fair
  dateClose?: Date | null;  // For custom fair
  datesOpenInFair?: Date[] | null;  // Only with fair
  relatedLinks?: IBoothRelatedLink[];
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
  expenses: IBoothExpense[];
}

/* === Model for Backend (DB) === */
export interface IBoothModel extends Omit<IBoothCommon, "datesOpenInFair" | "status"> {
  datesOpenInFair?: string[] | null;   // JSON string array of "YYYY-MM-DD"
  status: BoothStatus;
  statusReason?: string | null;
  statusContentPublished: boolean;
  expenses: IBoothExpense[];
  bannerImageId?: number | null;
  infoImageId?: number | null;
}

/* === Requests === */
export interface IBoothCreateRequest extends Omit<IBoothCommon, "id" | "ownerId" | "noticeContent" | "status" | "datesOpenInFair" | "relatedLinks"> { }
export interface IBoothCreateWithFairRequest extends Omit<IBoothCommon, "id" | "ownerId" | "noticeContent" | "status" | "location" | "dateOpen" | "dateClose" | "relatedLinks"> { }
export interface IBoothUpdateRequest extends Partial<Omit<IBoothCommon, "id" | "ownerId" | "fairId" | "status" | "currencyCode">> { }
export interface IBoothNoticeUpdateRequest extends Pick<IBoothCommon, "noticeContent"> { }
export interface IBoothStatusUpdateRequest extends Partial<IBoothStatus> { }

/* === Responses === */
export interface IBoothResponse extends Omit<IBooth, "fairId"> { }
export interface IBoothAdminResponse extends IBoothAdmin { }
