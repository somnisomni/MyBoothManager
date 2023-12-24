import { IDataModelBase } from "./base";
import { GoodsStockVisibility } from "./goods";

export interface IGoodsCombination extends IDataModelBase {
  id: number;
  boothId: number;  // Foreign key to Booth.id
  categoryId?: number | null;  // Foreign key to GoodsCategory.id
  name: string;
  description?: string;
  price: number;
  // stockInitial: number;  <-- Calculated in backend (min of stockInitial of combined goods)
  // stockRemaining: number;  <-- Calculated in backend (min of stockRemaining of combined goods)
  stockVisibility: GoodsStockVisibility;
  combinationImageUrl?: string;
}
export type IGoodsCombinationResponse = IGoodsCombination;

export interface IGoodsCombinationModel extends Omit<IGoodsCombination, "combinationImageUrl"> {
  combinationImageId?: number | null;
}

export type GoodsCombinationCreateRequestKey = "boothId" | "categoryId" | "name" | "description" | "price";
export type IGoodsCombinationCreateRequest = Pick<IGoodsCombination, GoodsCombinationCreateRequestKey>;

export type GoodsCombinationUpdateRequestKey = "categoryId" | "name" | "description" | "price" | "stockVisibility";
export type IGoodsCombinationUpdateRequest = Pick<IGoodsCombination, "boothId"> & Partial<Pick<IGoodsCombination, GoodsCombinationUpdateRequestKey>>;