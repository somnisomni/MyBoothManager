import { IImageUploadInfo } from "./base";

/* === Common === */
interface IBoothCommon {
  id: number;
  ownerId: number;
  name: string;
  currencySymbol: string;
  description?: string | null;
  location?: string | null;
  boothNumber?: string | null;
  dateOpen?: Date | null;
  dateClose?: Date | null;
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

/* === Model for Backend (DB) === */
export interface IBoothModel extends Omit<IBoothCommon, "status"> {
  status: BoothStatus;
  statusReason?: string | null;
  statusContentPublished?: boolean | null;
  expenses: Array<IBoothExpense>;
  bannerImageId?: number | null;
  infoImageId?: number | null;
}

/* === Requests === */
export interface IBoothCreateRequest extends Omit<IBoothCommon, "id" | "ownerId" | "status"> { }
export interface IBoothUpdateRequest extends Partial<Omit<IBoothCommon, "id" | "ownerId" | "status">> { }
export interface IBoothStatusUpdateRequest extends IBoothStatus { }

/* === Responses === */
export interface IBoothResponse extends IBoothCommon {
  bannerImage?: IImageUploadInfo | null;
  infoImage?: IImageUploadInfo | null;
}

export interface IBoothAdminResponse extends IBoothResponse {
  expenses: Array<IBoothExpense>;
}
