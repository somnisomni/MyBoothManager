import { Exclude, Expose } from "class-transformer";
import { IGoodsCSVImportPreviewResponse, IGoodsCSVImportRequest } from "@myboothmanager/common";

export class GoodsImportRequestDto implements IGoodsCSVImportRequest {
  declare csv: string;
}

@Exclude()
export class GoodsImportPreviewResponseDto implements IGoodsCSVImportPreviewResponse {
  @Expose() declare goods: IGoodsCSVImportPreviewResponse["goods"];
  @Expose() declare categories: IGoodsCSVImportPreviewResponse["categories"];

  constructor(goods: IGoodsCSVImportPreviewResponse["goods"],
              categories: IGoodsCSVImportPreviewResponse["categories"]) {
    this.goods = goods;
    this.categories = categories;
  }
}
