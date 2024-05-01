import { IImageUploadInfo } from "./base";

/* === Common === */
export interface IGoodsCommon {
  id: number;
  boothId: number;
  categoryId?: number | null;
  combinationId?: number | null;
  name: string;
  description?: string | null;
  type?: string;
  price: number;
  stock: IGoodsStock;
  ownerMemberIds?: Array<number> | null;
}

export interface IGoodsStock {
  visibility: GoodsStockVisibility;
  initial?: number;
  remaining?: number;
}

/* === Enums === */
export enum GoodsStockVisibility {
  HIDE_ALL = "hide_all",
  SHOW_REMAINING_ONLY = "show_remaining_only",
  SHOW_ALL = "show_all",
}

/* === Model for Backend (DB) === */
export interface IGoodsModel extends Omit<IGoodsCommon, "stock" | "ownerMemberIds"> {
  stockVisibility: GoodsStockVisibility;
  stockInitial: number;
  stockRemaining: number;
  goodsImageId?: number | null;
}

/* === Requests === */
export interface IGoodsCreateRequest extends Omit<IGoodsCommon, "id" | "combinationId"> { }
export interface IGoodsUpdateRequest extends Partial<Omit<IGoodsCommon, "id" | "combinationId">> { }

/* === Responses === */
export interface IGoodsResponse extends IGoodsCommon {
  goodsImage?: IImageUploadInfo | null;
}

export interface IGoodsAdminResponse extends IGoodsResponse {
  stock: Required<IGoodsStock>;
}
