import { IImageUploadInfo } from "./base";
import { IGoodsCategory } from "./goods-category";

/* === Common === */
export interface IGoodsCommon {
  id: number;
  boothId: number;
  categoryId?: number | null;
  name: string;
  description?: string | null;
  price: number;
  stock: IGoodsStock;
  ownerMemberIds?: Array<number> | null;
}

interface IGoodsBase extends IGoodsCommon {
  combinationId?: number | null;
  type?: string | null;
}

export interface IGoodsStock {
  visibility: GoodsStockVisibility;
  initial?: number;
  remaining?: number;
}

export interface IGoodsFrontendCommon extends IGoodsBase {
  goodsImage?: IImageUploadInfo | null;
}

/* === Enums === */
export enum GoodsStockVisibility {
  HIDE_ALL = "hide_all",
  SHOW_REMAINING_ONLY = "show_remaining_only",
  SHOW_ALL = "show_all",
}

/* === Frontend === */
export interface IGoods extends IGoodsFrontendCommon { }

export interface IGoodsAdmin extends IGoods {
  stock: Required<IGoodsStock>;
}

/* === Model for Backend (DB) === */
export interface IGoodsModel extends Omit<IGoodsBase, "stock"> {
  stockVisibility: GoodsStockVisibility;
  stockInitial: number;
  stockRemaining: number;
  goodsImageId?: number | null;
}

/* === Requests === */
export interface IGoodsCreateRequest extends Omit<IGoodsBase, "id" | "combinationId" | "stock"> {
  stockVisibility: GoodsStockVisibility;
  stockInitial: number;
  stockRemaining: number;
}
export interface IGoodsUpdateRequest extends Partial<Omit<IGoodsCreateRequest, "boothId">>, Pick<IGoodsCreateRequest, "boothId"> { }
export interface IGoodsCSVImportRequest  {
  csv: string;
}

/* === Responses === */
export interface IGoodsResponse extends IGoods { }
export interface IGoodsAdminResponse extends IGoodsAdmin { }
export interface IGoodsCSVImportPreviewResponse {
  goods: Array<Pick<IGoodsAdmin, "name" | "categoryId" | "description" | "type" | "price" | "stock">>;
  categories: Array<Pick<IGoodsCategory, "name">>;
}
