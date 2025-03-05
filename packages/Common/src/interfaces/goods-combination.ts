import type { GoodsStockVisibility, IGoodsCommon, IGoodsFrontendCommon, IGoodsStock } from "./goods";

/* === Common === */
type IGoodsCombinationCommon = Omit<IGoodsCommon, "combinationId">;

/* === Frontend === */
export type IGoodsCombination = Omit<IGoodsFrontendCommon, "combinationId" | "type">;

export interface IGoodsCombinationAdmin extends IGoodsCombination {
  stock: Required<IGoodsStock>;
}

/* === Model for Backend (DB) === */
export interface IGoodsCombinationModel extends Omit<IGoodsCombinationCommon, "stock"> {
  stockVisibility: GoodsStockVisibility;
  stockInitial: number;
  stockRemaining: number;
  goodsImageId?: number | null;
}

/* === Requests === */
export interface IGoodsCombinationCreateRequest extends Omit<IGoodsCombinationCommon, "id" | "stock" | "ownerMemberIds"> {
  stockVisibility: GoodsStockVisibility;
  goodsIds: number[];
}

export interface IGoodsCombinationUpdateRequest extends Partial<Omit<IGoodsCombinationCommon, "id" | "boothId" | "ownerMemberIds">>, Pick<IGoodsCombinationCommon, "boothId"> {
  goodsIds?: number[] | null;
}

/* === Responses === */
export type IGoodsCombinationResponse = IGoodsCombination;
export type IGoodsCombinationAdminResponse = IGoodsCombinationAdmin;
