import type { InternalKeysWithId } from "@/lib/types";
import { GoodsStockVisibility, IGoodsCombinationModel } from "@myboothmanager/common";
import { DataTypes } from "sequelize";
import { Model, AllowNull, AutoIncrement, BelongsTo, Column, Default, ForeignKey, PrimaryKey, Table, Unique, HasMany } from "sequelize-typescript";
import Booth from "./booth";
import GoodsCategory from "./goods-category";
import UploadStorage from "./uploadstorage";
import Goods from "./goods";

export type GoodsCombinationCreationAttributes = Omit<IGoodsCombinationModel, InternalKeysWithId | "description">
                               & Partial<Pick<IGoodsCombinationModel, "description">>;

@Table
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
  get stockInitial(): number | null {
    if(this.combinedGoods) {
      return Math.min(...this.combinedGoods.map(g => g.stockInitial));
    } else {
      return null;
    }
  }

  @Column(DataTypes.VIRTUAL)
  get stockRemaining(): number | null {
    if(this.combinedGoods) {
      return Math.min(...this.combinedGoods.map(g => g.stockRemaining));
    } else {
      return null;
    }
  }

  @Column(DataTypes.VIRTUAL)
  get combinationImageUrl(): string | null {
    if(this.combinationImage) {
      return this.combinationImage.filePath;
    } else {
      return null;
    }
  }


  /* === Relations === */
  @HasMany(() => Goods)
  declare combinedGoods: Goods[];

  @BelongsTo(() => Booth)
  declare ownerBooth: Booth;

  @BelongsTo(() => GoodsCategory)
  declare assignedGoodsCategory?: GoodsCategory;

  @BelongsTo(() => UploadStorage, "combinationImageId")
  declare combinationImage?: UploadStorage;
}