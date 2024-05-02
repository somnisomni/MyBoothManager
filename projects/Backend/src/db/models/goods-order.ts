import { type IGoodsOrder, type IGoodsOrderItem, GoodsOrderPaymentMethod, GoodsOrderStatus, IGoodsOrderCreateRequest, IGoodsOrderModel } from "@myboothmanager/common";
import { DataTypes } from "sequelize";
import { Model, AutoIncrement, BelongsTo, Column, Default, ForeignKey, PrimaryKey, Table, Unique, AllowNull } from "sequelize-typescript";
import Booth from "./booth";

const orderSanitizerCallback = (order: IGoodsOrderItem): IGoodsOrderItem => {
  order.price = order.price ? parseFloat(new Number(order.price).toFixed(3)) : undefined;
  order.quantity = Math.floor(new Number(order.quantity).valueOf());
  return order;
};

@Table
export default class GoodsOrder extends Model<IGoodsOrder, IGoodsOrderCreateRequest> implements IGoodsOrderModel {
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
  get order(): Array<IGoodsOrderItem> { return this.getDataValue("order").map(orderSanitizerCallback); }
  set order(value: Array<IGoodsOrderItem>) { this.setDataValue("order", value.map(orderSanitizerCallback)); }

  @AllowNull(false)
  @Default(GoodsOrderStatus.RECORDED)
  @Column(DataTypes.ENUM(...Object.values(GoodsOrderStatus)))
  declare status: GoodsOrderStatus;

  @AllowNull(false)
  @Column(DataTypes.INTEGER.UNSIGNED)
  get totalRevenue(): number { return Math.floor(this.getDataValue("totalRevenue")); }
  set totalRevenue(value: number) { this.setDataValue("totalRevenue", Math.floor(value)); }

  @AllowNull
  @Default(GoodsOrderPaymentMethod.CASH)
  @Column(DataTypes.ENUM(...Object.values(GoodsOrderPaymentMethod)))
  declare paymentMethod?: GoodsOrderPaymentMethod;


  /* === Relations === */
  @BelongsTo(() => Booth)
  declare ownerBooth: Booth;
}
