import { ModelAttributes, Model, DataTypes } from "sequelize";
import { GoodsOrderStatus, IGoodsOrder, IGoodsOrderDetailItem } from "@myboothmanager/common";
import { type InternalKeysWithId } from "@/lib/types";
import { boothModelName } from "./booth";

export type GoodsOrderCreationAttributes = Omit<IGoodsOrder, InternalKeysWithId>;
export default class GoodsOrder extends Model<IGoodsOrder, GoodsOrderCreationAttributes> implements IGoodsOrder {
  declare id: number;
  declare boothId: number;
  declare order: Array<IGoodsOrderDetailItem>;
  declare status: GoodsOrderStatus;
  declare totalPrice: number;
}

export const goodsOrderModelName = "GoodsOrder";
export const goodsOrderModelAttrib: ModelAttributes<GoodsOrder> = {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  boothId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: boothModelName,
      key: "id",
    },
  },
  order: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(...Object.values(GoodsOrderStatus)),
    allowNull: false,
    defaultValue: GoodsOrderStatus.RECORDED,
  },
  totalPrice: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
};
