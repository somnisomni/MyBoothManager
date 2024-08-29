import { GoodsStockVisibility, IGoodsAdminResponse, IGoodsResponse, IGoodsStock, IImageUploadInfo } from "@myboothmanager/common";
import { Exclude, Expose } from "class-transformer";
import deepClone from "clone-deep";
import Goods from "@/db/models/goods";

@Exclude()
export class GoodsResponseDto implements IGoodsResponse {
  @Expose() declare id: number;
  @Expose() declare categoryId?: number | null;
  @Expose() declare combinationId?: number | null;
  @Expose() declare name: string;
  @Expose() declare description?: string | null;
  @Expose() declare type?: string | null;
  @Expose() declare price: number;
  @Expose() declare stock: IGoodsStock;
  @Expose() declare ownerMemberIds?: number[] | null;
  @Expose() declare goodsImage?: IImageUploadInfo | null;

  @Exclude() boothId = NaN;

  constructor(model: Goods) {
    const values = model.get();

    this.id = values.id;
    this.categoryId = values.categoryId;
    this.combinationId = values.combinationId;
    this.name = values.name;
    this.description = values.description;
    this.type = values.type;
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
export class AdminGoodsResponseDto extends GoodsResponseDto implements IGoodsAdminResponse {
  @Expose() declare stock: Required<IGoodsStock>;

  constructor(model: Goods) {
    super(model);
    const values = model.get();

    this.stock = {
      visibility: values.stockVisibility,
      initial: values.stockInitial,
      remaining: values.stockRemaining,
    };
  }
}
