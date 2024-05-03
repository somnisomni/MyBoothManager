import type { IGoods, IGoodsFrontendCommon, IGoodsCombination, IGoodsStock, IImageUploadInfo } from "@myboothmanager/common";
import deepClone from "clone-deep";

export abstract class GoodsBase implements IGoodsFrontendCommon {
  declare id: number;
  declare boothId: number;
  declare categoryId?: number | null;
  declare name: string;
  declare description?: string | null;
  declare price: number;
  declare stock: IGoodsStock;
  declare ownerMemberIds?: number[] | null;
  declare goodsImage?: IImageUploadInfo | null;

  protected constructor(data: IGoodsFrontendCommon) {
    this.update(data);
  }

  /**
   * Update(Overwrite) the data of this instance.
   * @param data - Data to update.
   */
  update(data: IGoods): void {
    this.id = data.id;
    this.boothId = data.boothId;
    this.categoryId = data.categoryId;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.stock = deepClone(data.stock);
    this.ownerMemberIds = deepClone(data.ownerMemberIds);
    this.goodsImage = deepClone(data.goodsImage);
  }

  /**
   * Convert this instance to a deeply copied plain object.
   * @returns Deeply copied plain object of the instance.
   */
  toPlainObject(): IGoodsFrontendCommon {
    return {
      id: this.id,
      boothId: this.boothId,
      categoryId: this.categoryId,
      name: this.name,
      description: this.description,
      price: this.price,
      stock: deepClone(this.stock),
      ownerMemberIds: deepClone(this.ownerMemberIds),
      goodsImage: deepClone(this.goodsImage),
    } as IGoodsFrontendCommon;
  }
}

export class Goods extends GoodsBase implements IGoods {
  declare combinationId?: number | null;
  declare type?: string | null;

  constructor(data: IGoods) {
    super(data);
    this.update(data);
  }

  override update(data: IGoods): void {
    super.update(data);
    this.combinationId = data.combinationId;
    this.type = data.type;
  }

  override toPlainObject(): IGoods {
    return {
      ...super.toPlainObject(),
      combinationId: this.combinationId,
      type: this.type,
    } as IGoods;
  }
}

export class GoodsCombination extends GoodsBase implements IGoodsCombination {
  constructor(data: IGoodsCombination) {
    super(data);
    this.update(data);
  }

  override update(data: IGoodsCombination): void {
    super.update(data);
  }

  override toPlainObject(): IGoodsCombination {
    return {
      ...super.toPlainObject(),
    } as IGoodsCombination;
  }
}
