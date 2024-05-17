/* === Common === */
interface IFairCommon {
  id: number;
  name: string;
  location: string;
  startDate: Date;
  endDate: Date;
  websiteUrl?: string | null;
}

/* === Frontend === */
export interface IFair extends IFairCommon { }

/* === Model for Backend (DB) === */
export interface IFairModel extends IFairCommon { }

/* === Requests === */
export interface IFairCreateRequest extends Omit<IFairCommon, "id"> { }
export interface IFairUpdateRequest extends Partial<IFairCreateRequest> { }

/* === Responses === */
export interface IFairResponse extends IFair { }
