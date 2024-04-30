import type { InternalKeysWithId } from "@/lib/types";
import { GoodsStockVisibility, GoodsWithoutAllStockInfoOmitKey, GoodsWithoutInitialStockInfoOmitKey, IGoodsCombinationModel } from "@myboothmanager/common";
import { DataTypes } from "sequelize";
import { Model, AllowNull, AutoIncrement, BelongsTo, Column, Default, ForeignKey, PrimaryKey, Table, Unique, HasMany, DefaultScope } from "sequelize-typescript";
import { deleteKeys } from "@/lib/common-functions";
import Booth from "./booth";
import GoodsCategory from "./goods-category";
import UploadStorage from "./uploadstorage";
import Goods from "./goods";

export type GoodsCombinationCreationAttributes = Omit<IGoodsCombinationModel, InternalKeysWithId | "description">
                               & Partial<Pick<IGoodsCombinationModel, "description">>;

@Table
@DefaultScope(() => ({
  include: [
    { model: Goods, as: "combinedGoods" },
    { model: UploadStorage, as: "combinationImage" },
  ],
}))
export default class GoodsCombination extends Model<IGoodsCombinationModel, GoodsCombinationCreationAttributes> implements IGoodsCombinationModel {
  @PrimaryKey
  @Unique
  @AutoIncrement
  @AllowNull(false)
  @Column(DataTypes.INTEGER.UNSIGNED)
  declare id: number;

  @AllowNull(false)
  @ForeignKey(() => Booth)
  @Column(DataTypes.INTEGER.UNSIGNED)
  declare boothId: number;

  @AllowNull
  @Default(null)
  @ForeignKey(() => GoodsCategory)
  @Column(DataTypes.INTEGER.UNSIGNED)
  declare categoryId?: number | null;

  @AllowNull(false)
  @Column(DataTypes.STRING(128))
  declare name: string;

  @AllowNull
  @Default(null)
  @Column(DataTypes.STRING(1024))
  declare description?: string;

  @AllowNull(false)
  @Column(DataTypes.FLOAT.UNSIGNED)
  get price(): number { return parseFloat(this.getDataValue("price").toFixed(3)); }
  set price(value: number) { this.setDataValue("price", parseFloat(new Number(value).toFixed(3))); }

  @AllowNull(false)
  @Default(GoodsStockVisibility.SHOW_ALL)
  @Column(DataTypes.ENUM(...Object.values(GoodsStockVisibility)))
  declare stockVisibility: GoodsStockVisibility;

  @AllowNull
  @Default(null)
  @ForeignKey(() => UploadStorage)
  @Column(DataTypes.INTEGER.UNSIGNED)
  declare combinationImageId?: number | null;

  @Column(DataTypes.VIRTUAL)
  get stockInitial(): number {
    if(this.combinedGoods && this.combinedGoods.length > 0) {
      return Math.min(...this.combinedGoods.map(g => g.stockInitial));
    } else {
      return 0;
    }
  }

  @Column(DataTypes.VIRTUAL)
  get stockRemaining(): number {
    if(this.combinedGoods && this.combinedGoods.length > 0) {
      return Math.min(...this.combinedGoods.map(g => g.stockRemaining));
    } else {
      return 0;
    }
  }

  @Column(DataTypes.VIRTUAL)
  get ownerMemberIds(): number[] {
    if(this.combinedGoods && this.combinedGoods.length > 0) {
      return this.combinedGoods.flatMap(g => (g.ownerMembersId ?? []).flat());
    } else {
      return [];
    }
  }

  @Column(DataTypes.VIRTUAL)
  get combinationImageUrl(): string | null {
    if(this.combinationImage) {
      return this.combinationImage.filePath ?? null;
    } else {
      return null;
    }
  }

  @Column(DataTypes.VIRTUAL)
  get combinationImageThumbnailData(): string | null {
    if(this.combinationImage) {
      return this.combinationImage.imageThumbnailBase64 ?? null;
    } else {
      return null;
    }
  }


  /* === Relations === */
  @BelongsTo(() => Booth)
  declare ownerBooth: Booth;

  @HasMany(() => Goods)
  declare combinedGoods: Goods[];

  @BelongsTo(() => GoodsCategory)
  declare assignedGoodsCategory?: GoodsCategory;

  @BelongsTo(() => UploadStorage, "combinationImageId")
  declare combinationImage?: UploadStorage;


  /* === Functions === */
  getForPublic(): IGoodsCombinationModel {
    const thisGet = this.get();

    if(thisGet.stockVisibility === GoodsStockVisibility.HIDE_ALL) {
      deleteKeys(thisGet as unknown as Record<string, unknown>, GoodsWithoutAllStockInfoOmitKey);
    } else if(thisGet.stockVisibility === GoodsStockVisibility.SHOW_REMAINING_ONLY) {
      deleteKeys(thisGet as unknown as Record<string, unknown>, GoodsWithoutInitialStockInfoOmitKey);
    }

    return thisGet;
  }
}
