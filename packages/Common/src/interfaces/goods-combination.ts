/* eslint-disable import/exports-last */
// TODO: Intersection types is not working as expected

import { IGoodsAdminResponse, IGoodsCommon, IGoodsModel, IGoodsResponse } from "./goods";

/* === Common === */
interface IGoodsCombinationCommon extends Omit<IGoodsCommon, "combinationId" | "type"> { }

/* === Model for Backend (DB) === */
type GoodsCombinationModelBase = IGoodsCombinationCommon & IGoodsModel;
export interface IGoodsCombinationModel extends GoodsCombinationModelBase { }

/* === Requests === */
export interface IGoodsCombinationCreateRequest extends Omit<IGoodsCombinationCommon, "id"> {
  goodsIds: Array<number>;
}

export interface IGoodsCombinationUpdateRequest extends Partial<Omit<IGoodsCombinationCommon, "id" | "boothId">>, Pick<IGoodsCombinationCommon, "boothId"> {
  goodsIds?: Array<number> | null;
}

/* === Responses === */
type GoodsCombinationResponseBase = IGoodsCombinationCommon & IGoodsResponse;
export interface IGoodsCombinationResponse extends GoodsCombinationResponseBase { }

type GoodsCombinationAdminResponseBase = IGoodsCombinationCommon & IGoodsAdminResponse;
export interface IGoodsCombinationAdminResponse extends GoodsCombinationAdminResponseBase { }
