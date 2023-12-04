import type { InternalKeysWithId } from "@/lib/types";
import { type IGoods, GoodsStatus, GoodsStockVisibility } from "@myboothmanager/common";
import { DataTypes } from "sequelize";
import { Model, AllowNull, AutoIncrement, BelongsTo, Column, Default, ForeignKey, PrimaryKey, Table, Unique } from "sequelize-typescript";
import Booth from "./booth";
import GoodsCategory from "./goods-category";

export type GoodsCreationAttributes = Omit<IGoods, InternalKeysWithId | "description" | "type" | "status" | "statusReason">
                               & Partial<Pick<IGoods, "description" | "type" | "status" | "statusReason">>;

@Table
export default class Goods extends Model<IGoods, GoodsCreationAttributes> implements IGoods {
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
  @Column(DataTypes.INTEGER.UNSIGNED)
  declare price: number;

  @AllowNull(false)
  @Column(DataTypes.INTEGER.UNSIGNED)
  declare stockInitial: number;

  @AllowNull(false)
  @Column(DataTypes.INTEGER.UNSIGNED)
  declare stockRemaining: number;

  @AllowNull(false)
  @Default(GoodsStockVisibility.SHOW_ALL)
  @Column(DataTypes.ENUM(...Object.values(GoodsStockVisibility)))
  declare stockVisibility: GoodsStockVisibility;


  /* === Relations === */
  @BelongsTo(() => Booth)
  declare ownerBooth: Booth;

  @BelongsTo(() => GoodsCategory)
  declare assignedGoodsCategory?: GoodsCategory;
}
