/* eslint-disable @typescript-eslint/no-empty-object-type */

/* === Common === */
interface IGoodsCategoryCommon {
  id: number;
  boothId: number;
  name: string;
}

/* === Frontend === */
export interface IGoodsCategory extends IGoodsCategoryCommon { }

/* === Model for Backend (DB) === */
export interface IGoodsCategoryModel extends IGoodsCategoryCommon { }

/* === Requests === */
export interface IGoodsCategoryCreateRequest extends Omit<IGoodsCategoryCommon, "id"> { }
export interface IGoodsCategoryUpdateRequest extends Partial<Omit<IGoodsCategoryCommon, "id" | "boothId">>, Pick<IGoodsCategoryCommon, "boothId"> { }

/* === Responses === */
export interface IGoodsCategoryResponse extends IGoodsCategory { }
