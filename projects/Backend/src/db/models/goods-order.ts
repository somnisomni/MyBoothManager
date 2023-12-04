import type { InternalKeysWithId } from "@/lib/types";
import { type IGoodsOrder, type IGoodsOrderDetailItem, GoodsOrderStatus } from "@myboothmanager/common";
import { DataTypes } from "sequelize";
import { Model, AutoIncrement, BelongsTo, Column, Default, ForeignKey, PrimaryKey, Table, Unique, AllowNull } from "sequelize-typescript";
import Booth from "./booth";

export type GoodsOrderCreationAttributes = Omit<IGoodsOrder, InternalKeysWithId>;

@Table
export default class GoodsOrder extends Model<IGoodsOrder, GoodsOrderCreationAttributes> implements IGoodsOrder {
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

  @AllowNull(false)
  @Column(DataTypes.JSON)
  declare order: Array<IGoodsOrderDetailItem>;

  @AllowNull(false)
  @Default(GoodsOrderStatus.RECORDED)
  @Column(DataTypes.ENUM(...Object.values(GoodsOrderStatus)))
  declare status: GoodsOrderStatus;

  @AllowNull(false)
  @Column(DataTypes.INTEGER.UNSIGNED)
  declare totalPrice: number;


  /* === Relations === */
  @BelongsTo(() => Booth)
  declare ownerBooth: Booth;
}
