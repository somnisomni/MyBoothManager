import type { InternalKeysWithId } from "@/lib/types";
import { GoodsStatus, GoodsStockVisibility, IGoodsModel } from "@myboothmanager/common";
import { DataTypes } from "sequelize";
import { Model, AllowNull, AutoIncrement, BelongsTo, Column, Default, ForeignKey, PrimaryKey, Table, Unique } from "sequelize-typescript";
import Booth from "./booth";
import GoodsCategory from "./goods-category";
import UploadStorage from "./uploadstorage";
import GoodsCombination from "./goods-combination";

export type GoodsCreationAttributes = Omit<IGoodsModel, InternalKeysWithId | "description" | "type" | "status" | "statusReason">
                               & Partial<Pick<IGoodsModel, "description" | "type" | "status" | "statusReason">>;

@Table
export default class Goods extends Model<IGoodsModel, GoodsCreationAttributes> implements IGoodsModel {
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

  @AllowNull
  @Default(null)
  @ForeignKey(() => GoodsCombination)
  @Column(DataTypes.INTEGER.UNSIGNED)
  declare combinationId?: number | null;

  @AllowNull(false)
  @Column(DataTypes.STRING(128))
  declare name: string;

  @AllowNull
  @Default(null)
  @Column(DataTypes.STRING(1024))
  declare description?: string;

  @AllowNull
  @Default(null)
  @Column(DataTypes.STRING(128))
  declare type?: string;

  @AllowNull(false)
  @Default(GoodsStatus.ON_SALE)
  @Column(DataTypes.ENUM(...Object.values(GoodsStatus)))
  declare status: GoodsStatus;

  @AllowNull
  @Default(null)
  @Column(DataTypes.STRING(1024))
  declare statusReason?: string;

  @AllowNull(false)
  @Column(DataTypes.FLOAT.UNSIGNED)
  get price(): number { return parseFloat(this.getDataValue("price").toFixed(3)); }
  set price(value: number) { this.setDataValue("price", parseFloat(new Number(value).toFixed(3))); }

  @AllowNull(false)
  @Column(DataTypes.INTEGER.UNSIGNED)
  get stockInitial(): number { return Math.floor(this.getDataValue("stockInitial")); }
  set stockInitial(value: number) { this.setDataValue("stockInitial", Math.floor(new Number(value).valueOf())); }

  @AllowNull(false)
  @Column(DataTypes.INTEGER.UNSIGNED)
  get stockRemaining(): number { return Math.floor(this.getDataValue("stockRemaining")); }
  set stockRemaining(value: number) { this.setDataValue("stockRemaining", Math.floor(new Number(value).valueOf())); }

  @AllowNull(false)
  @Default(GoodsStockVisibility.SHOW_ALL)
  @Column(DataTypes.ENUM(...Object.values(GoodsStockVisibility)))
  declare stockVisibility: GoodsStockVisibility;

  @AllowNull
  @Default(null)
  @ForeignKey(() => UploadStorage)
  @Column(DataTypes.INTEGER.UNSIGNED)
  declare goodsImageId?: number | null;

  @Column(DataTypes.VIRTUAL)
  get goodsImageUrl(): string | null {
    if(this.goodsImage) {
      return this.goodsImage.filePath;
    } else {
      return null;
    }
  }


  /* === Relations === */
  @BelongsTo(() => Booth)
  declare ownerBooth: Booth;

  @BelongsTo(() => GoodsCategory)
  declare assignedGoodsCategory?: GoodsCategory;

  @BelongsTo(() => GoodsCombination)
  declare assignedGoodsCombination?: GoodsCombination;

  @BelongsTo(() => UploadStorage, "goodsImageId")
  declare goodsImage?: UploadStorage;
}
