import { IGoodsCommon } from "./goods";

export interface IGoodsCombination extends IGoodsCommon {
  combinationImageUrl?: string | null;
  combinationImageThumbnailData?: string | null;
}
export type IGoodsCombinationResponse = IGoodsCombination;

export interface IGoodsCombinationModel extends Omit<IGoodsCombination, "stockInitial" | "stockRemaining" | "combinationImageUrl" | "combinationImageThumbnailData"> {
  combinationImageId?: number | null;
}

export type GoodsCombinationCreateRequestKey = "boothId" | "categoryId" | "name" | "description" | "price" | "stockVisibility";
export type IGoodsCombinationCreateRequest = Pick<IGoodsCombination, GoodsCombinationCreateRequestKey> & { goodsIds: number[] };

export type GoodsCombinationUpdateRequestKey = "categoryId" | "name" | "description" | "price" | "stockVisibility";
export type IGoodsCombinationUpdateRequest = Pick<IGoodsCombination, "boothId"> & Partial<Pick<IGoodsCombination, GoodsCombinationUpdateRequestKey>> & { goodsIds?: number[] };
