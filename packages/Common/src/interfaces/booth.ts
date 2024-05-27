import { IFairInfo, IImageUploadInfo } from "./base";

/* === Common === */
interface IBoothCommon {
  id: number;
  ownerId: number;
  fairId?: number | null;
  name: string;
  currencySymbol: string;
  description?: string | null;
  boothNumber?: string | null;
  status: IBoothStatus;
  location?: string | null; // For custom fair
  dateOpen?: Date | null;   // For custom fair
  dateClose?: Date | null;  // For custom fair
  datesOpenInFair?: Array<Date> | null;  // Only with fair
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

/* === Enums === */
export enum BoothStatus {
  OPEN = "open",
  PAUSE = "pause",
  CLOSE = "close",
  PREPARE = "prepare",
}

/* === Frontend === */
export interface IBooth extends IBoothCommon {
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
export interface IBoothCreateRequest extends Omit<IBoothCommon, "id" | "ownerId" | "status" | "datesOpenInFair"> { }
export interface IBoothCreateWithFairRequest extends Omit<IBoothCommon, "id" | "ownerId" | "status" | "location" | "dateOpen" | "dateClose"> { }
export interface IBoothUpdateRequest extends Partial<Omit<IBoothCommon, "id" | "ownerId" | "fairId" | "status" | "currencySymbol">> { }
export interface IBoothStatusUpdateRequest extends Partial<IBoothStatus> { }

/* === Responses === */
export interface IBoothResponse extends Omit<IBooth, "fairId"> { }
export interface IBoothAdminResponse extends IBoothAdmin { }
