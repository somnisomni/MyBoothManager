/* eslint-disable @typescript-eslint/no-empty-object-type */

/* === Common === */
interface IFairCommon {
  id: number;
  name: string;
  description?: string | null;
  location: string;
  openingDates: Date[];
  websiteUrl?: string | null;
}

/* === Frontend === */
export interface IFair extends IFairCommon { }

/* === Model for Backend (DB) === */
export interface IFairModel extends Omit<IFairCommon, "openingDates"> {
  openingDates: string[];    // JSON string array of "YYYY-MM-DD"
}

/* === Requests === */
export interface IFairCreateRequest extends Omit<IFairCommon, "id"> { }
export interface IFairUpdateRequest extends Partial<IFairCreateRequest> { }

/* === Responses === */
export interface IFairResponse extends IFair { }
export interface ISuperAdminFairResponse extends IFairResponse {
  isPassed?: boolean;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}
