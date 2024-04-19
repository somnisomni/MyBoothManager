import type { IGoods, IGoodsCommon, IGoodsCombination, GoodsStockVisibility } from "@myboothmanager/common";
import { GoodsStatus } from "@myboothmanager/common";

export abstract class GoodsBase implements IGoodsCommon {
  declare id: number;
  declare boothId: number;
  declare categoryId?: number | null | undefined;
  declare name: string;
  declare description?: string | undefined;
  declare price: number;
  declare stockInitial: number;
  declare stockRemaining: number;
  declare stockVisibility: GoodsStockVisibility;
  declare ownerMembersId?: number[] | undefined;

  protected constructor(data: IGoodsCommon) {
    this.update(data);
  }

  /**
   * Update(Overwrite) the data of this instance.
   * @param data - Data to update.
   */
  update(data: IGoodsCommon): void {
    this.id = data.id;
    this.boothId = data.boothId;
    this.categoryId = data.categoryId;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.stockInitial = data.stockInitial;
    this.stockRemaining = data.stockRemaining;
    this.stockVisibility = data.stockVisibility;
    this.ownerMembersId = Array.from(data.ownerMembersId ?? []);
  }

  /**
   * Try increase or decrease stock count.
   * @param amount - Amount of stock to adjust.
   * @returns `number` - Remaining stock count after adjustment.
   * @returns `false` - If adjustment of stock count is not acceptable.
   */
  tryAdjustStock(amount: number): number | false {
    if((this.stockRemaining + amount < 0)
      || (this.stockInitial < this.stockRemaining + amount)) {
      return false;
    }

    this.stockRemaining += amount;
    return this.stockRemaining;
  }

  /**
   * Convert this instance to a plain object.
   * @returns Plain object of the instance.
   */
  toPlainObject(): IGoodsCommon {
    return {
      id: this.id,
      boothId: this.boothId,
      categoryId: this.categoryId,
      name: this.name,
      description: this.description,
      price: this.price,
      stockInitial: this.stockInitial,
      stockRemaining: this.stockRemaining,
      stockVisibility: this.stockVisibility,
      ownerMembersId: Array.from(this.ownerMembersId ?? []),
    } as IGoodsCommon;
  }
}

export class Goods extends GoodsBase implements IGoods {
  declare combinationId?: number | null;
  declare type?: string;
  declare status: GoodsStatus;
  declare statusReason?: string | null;
  declare goodsImageUrl?: string;

  constructor(data: IGoods) {
    super(data);
    this.update(data);
  }

  override update(data: IGoods): void {
    super.update(data);
    this.combinationId = data.combinationId;
    this.type = data.type;
    this.status = data.status;
    this.statusReason = data.statusReason;
    this.goodsImageUrl = data.goodsImageUrl;
  }

  override toPlainObject(): IGoods {
    return {
      ...super.toPlainObject(),
      combinationId: this.combinationId,
      type: this.type,
      status: this.status,
      statusReason: this.statusReason,
      goodsImageUrl: this.goodsImageUrl,
    } as IGoods;
  }
}

export class GoodsCombination extends GoodsBase implements IGoodsCombination {
  declare combinationImageUrl?: string | undefined;

  constructor(data: IGoodsCombination) {
    super(data);
    this.update(data);
  }

  override update(data: IGoodsCombination): void {
    super.update(data);
    this.combinationImageUrl = data.combinationImageUrl;
  }

  override toPlainObject(): IGoodsCombination {
    return {
      ...super.toPlainObject(),
      combinationImageUrl: this.combinationImageUrl,
    } as IGoodsCombination;
  }
}
