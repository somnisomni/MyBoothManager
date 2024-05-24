import { IImageUploadInfo } from "./base";

/* === Common === */
interface IBoothCommon {
  id: number;
  ownerId: number;
  fairId?: number | null;
  name: string;
  currencySymbol: string;
  description?: string | null;
  location?: string | null;
  boothNumber?: string | null;
  dateOpen?: Date | null;   // For custom fair
  dateClose?: Date | null;  // For custom fair
  datesOpenInFair?: Array<Date> | null;  // For selected fair
  status: IBoothStatus;
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
export interface IBoothCreateRequest extends Omit<IBoothCommon, "id" | "ownerId" | "status"> { }
export interface IBoothUpdateRequest extends Partial<Omit<IBoothCommon, "id" | "ownerId" | "fairId" | "status" | "currencySymbol">> { }
export interface IBoothStatusUpdateRequest extends Partial<IBoothStatus> { }

/* === Responses === */
export interface IBoothResponse extends IBooth { }
export interface IBoothAdminResponse extends IBoothAdmin { }
