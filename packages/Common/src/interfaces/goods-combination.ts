/* eslint-disable import/exports-last */

import { IImageUploadInfo } from "./base";
import { GoodsStockVisibility, IGoodsCommon, IGoodsStock } from "./goods";

/* === Common === */
interface IGoodsCombinationCommon extends Omit<IGoodsCommon, "combinationId" | "type"> { }

/* === Frontend === */
export interface IGoodsCombination extends IGoodsCombinationCommon {
  goodsImage?: IImageUploadInfo | null;
}

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
export interface IGoodsCombinationCreateRequest extends Omit<IGoodsCombinationCommon, "id"> {
  goodsIds: Array<number>;
}

export interface IGoodsCombinationUpdateRequest extends Partial<Omit<IGoodsCombinationCommon, "id" | "boothId">>, Pick<IGoodsCombinationCommon, "boothId"> {
  goodsIds?: Array<number> | null;
}

/* === Responses === */
export interface IGoodsCombinationResponse extends IGoodsCombination { }
export interface IGoodsCombinationAdminResponse extends IGoodsCombinationAdmin { }
