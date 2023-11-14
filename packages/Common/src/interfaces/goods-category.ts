import type { IDataModelBase } from "./base";

export interface IGoodsCategory extends IDataModelBase {
  id: number;
  boothId: number;  // Foreign key to Booth.id
  name: string;
}
export type IGoodsCategoryResponse = IGoodsCategory;

export type GoodsCategoryCreateRequestKey = "boothId" | "name";
export type IGoodsCategoryCreateRequest = Pick<IGoodsCategory, GoodsCategoryCreateRequestKey>;

export type GoodsCategoryUpdateRequestKey = "name";
export type IGoodsCategoryUpdateRequest = Pick<IGoodsCategory, "boothId"> & Partial<Pick<IGoodsCategory, GoodsCategoryUpdateRequestKey>>;
