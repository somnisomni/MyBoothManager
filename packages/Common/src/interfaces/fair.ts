/* === Common === */
/** @note This interface is used to be a base of fair interfaces. This should not be used directly in the frontend unless it's necessary. */
export interface IFairCommon {
  id: number;
  name: string;
  description?: string | null;
  location: string;
  openingDates: Date[];
  websiteUrl?: string | null;
}

/* === Frontend === */
export type IFair = IFairCommon;

/* === Model for Backend (DB) === */
export interface IFairModel extends Omit<IFairCommon, "openingDates"> {
  openingDates: string[];    // JSON string array of "YYYY-MM-DD"
}

/* === Requests === */
export type IFairCreateRequest = Omit<IFairCommon, "id">;
export type IFairUpdateRequest = Partial<IFairCreateRequest>;

/* === Responses === */
export type IFairResponse = IFair;
export interface ISuperAdminFairResponse extends IFairResponse {
  isPassed?: boolean;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}
