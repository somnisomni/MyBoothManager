/* eslint-disable import/exports-last */

import { GoodsStockVisibility, IGoodsCommon, IGoodsFrontendCommon, IGoodsStock } from "./goods";

/* === Common === */
interface IGoodsCombinationCommon extends Omit<IGoodsCommon, "combinationId"> { }

/* === Frontend === */
export interface IGoodsCombination extends Omit<IGoodsFrontendCommon, "combinationId" | "type"> { }

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
  goodsIds: Array<number>;
}

export interface IGoodsCombinationUpdateRequest extends Partial<Omit<IGoodsCombinationCommon, "id" | "boothId" | "ownerMemberIds">>, Pick<IGoodsCombinationCommon, "boothId"> {
  goodsIds?: Array<number> | null;
}

/* === Responses === */
export interface IGoodsCombinationResponse extends IGoodsCombination { }
export interface IGoodsCombinationAdminResponse extends IGoodsCombinationAdmin { }
