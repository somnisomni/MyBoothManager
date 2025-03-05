/* === Common === */
/** @note This interface is used to be a base of goods category interfaces. This should not be used directly in the frontend unless it's necessary. */
export interface IGoodsCategoryCommon {
  id: number;
  boothId: number;
  name: string;
}

/* === Frontend === */
export type IGoodsCategory = IGoodsCategoryCommon;

/* === Model for Backend (DB) === */
export type IGoodsCategoryModel = IGoodsCategoryCommon;

/* === Requests === */
export type IGoodsCategoryCreateRequest = Omit<IGoodsCategoryCommon, "id">;
export interface IGoodsCategoryUpdateRequest extends Partial<Omit<IGoodsCategoryCommon, "id" | "boothId">>, Pick<IGoodsCategoryCommon, "boothId"> { }

/* === Responses === */
export type IGoodsCategoryResponse = IGoodsCategory;
