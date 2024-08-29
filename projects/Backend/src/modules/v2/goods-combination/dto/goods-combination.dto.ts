import { GoodsStockVisibility, IGoodsCombinationResponse, IGoodsStock, IImageUploadInfo } from "@myboothmanager/common";
import { Exclude, Expose } from "class-transformer";
import deepClone from "clone-deep";
import GoodsCombination from "@/db/models/goods-combination";

@Exclude()
export class GoodsCombinationResponseDto implements IGoodsCombinationResponse {
  @Expose() declare id: number;
  @Expose() declare categoryId?: number | null;
  @Expose() declare name: string;
  @Expose() declare description?: string | null;
  @Expose() declare price: number;
  @Expose() declare stock: IGoodsStock;
  @Expose() declare ownerMemberIds?: number[] | null;
  @Expose() declare goodsImage?: IImageUploadInfo | null;

  @Exclude() boothId = NaN;

  constructor(model: GoodsCombination) {
    const values = model.get();

    this.id = values.id;
    this.categoryId = values.categoryId;
    this.name = values.name;
    this.description = values.description;
    this.price = values.price;
    this.stock = {
      visibility: values.stockVisibility,
      initial: values.stockVisibility === GoodsStockVisibility.SHOW_ALL ? values.stockInitial : undefined,
      remaining: values.stockVisibility !== GoodsStockVisibility.HIDE_ALL ? values.stockRemaining : undefined,
    };
    this.ownerMemberIds = deepClone(values.ownerMemberIds);
    this.goodsImage = model.goodsImage?.toImageUploadInfo();
  }
}

@Exclude()
export class AdminGoodsCombinationResponseDto extends GoodsCombinationResponseDto implements IGoodsCombinationResponse {
  @Expose() declare stock: Required<IGoodsStock>;

  constructor(model: GoodsCombination) {
    super(model);
    const values = model.get();

    this.stock = {
      visibility: values.stockVisibility,
      initial: values.stockInitial,
      remaining: values.stockRemaining,
    };
  }
}
