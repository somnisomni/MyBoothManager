import type { IDataModelBase } from "./base";

export enum GoodsStatus {
  ON_SALE ="on_sale",
  PAUSE = "pause",
  SOLD_OUT = "sold_out",
}

export enum GoodsStockVisibility {
  HIDE_ALL = "hide_all",
  SHOW_REMAINING_ONLY = "show_remaining_only",
  SHOW_ALL = "show_all",
}

export interface IGoods extends IDataModelBase {
  id: number;
  boothId: number;  // Foreign key to Booth.id
  categoryId?: number | null;  // Foreign key to GoodsCategory.id
  name: string;
  description?: string;
  type?: string;
  status: GoodsStatus;
  statusReason?: string;
  price: number;
  stockInitial: number;
  stockRemaining: number;
  stockVisibility: GoodsStockVisibility;
  goodsImageUrl?: string;
}
export type IGoodsResponse = IGoods;

export interface IGoodsModel extends Omit<IGoods, "goodsImageUrl"> {
  goodsImageId?: number | null;
}

export type GoodsCreateRequestKey = "boothId" | "categoryId" | "name" | "description" | "type" | "price" | "stockInitial" | "stockRemaining";
export type IGoodsCreateRequest = Pick<IGoods, GoodsCreateRequestKey>;

export type GoodsUpdateRequestKey = "categoryId" | "name" | "description" | "type" | "price" | "stockInitial" | "stockRemaining" | "status" | "statusReason" | "stockVisibility";
export type IGoodsUpdateRequest = Pick<IGoods, "boothId"> & Partial<Pick<IGoods, GoodsUpdateRequestKey>>;
