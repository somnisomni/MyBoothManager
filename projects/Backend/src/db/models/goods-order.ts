import type { InternalKeysWithId } from "@/lib/types";
import { type IGoodsOrder, type IGoodsOrderDetailItem, GoodsOrderStatus } from "@myboothmanager/common";
import { DataTypes } from "sequelize";
import { Model, AutoIncrement, BelongsTo, Column, Default, ForeignKey, PrimaryKey, Table, Unique, AllowNull } from "sequelize-typescript";
import Booth from "./booth";

const orderSanitizerCallback = (order: IGoodsOrderDetailItem): IGoodsOrderDetailItem => {
  order.price = order.price ? parseFloat(new Number(order.price).toFixed(3)) : undefined;
  order.quantity = Math.floor(new Number(order.quantity).valueOf());
  return order;
};

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
  get order(): Array<IGoodsOrderDetailItem> { return this.getDataValue("order").map(orderSanitizerCallback); }
  set order(value: Array<IGoodsOrderDetailItem>) { this.setDataValue("order", value.map(orderSanitizerCallback)); }

  @AllowNull(false)
  @Default(GoodsOrderStatus.RECORDED)
  @Column(DataTypes.ENUM(...Object.values(GoodsOrderStatus)))
  declare status: GoodsOrderStatus;

  @AllowNull(false)
  @Column(DataTypes.INTEGER.UNSIGNED)
  get totalPrice(): number { return Math.floor(this.getDataValue("totalPrice")); }
  set totalPrice(value: number) { this.setDataValue("totalPrice", Math.floor(value)); }


  /* === Relations === */
  @BelongsTo(() => Booth)
  declare ownerBooth: Booth;
}
