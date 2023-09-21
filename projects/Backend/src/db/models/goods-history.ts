import { ModelAttributes, Model, DataTypes } from "sequelize";
import { type IGoodsSaleHistory } from "@myboothmanager/common";
import { type InternalKeysWithId } from "@/lib/types";
import { goodsModelName } from "./goods";

export type GoodsSaleHistoryCreationAttributes = Omit<IGoodsSaleHistory, InternalKeysWithId>;
export default class GoodsSaleHistory extends Model<IGoodsSaleHistory, GoodsSaleHistoryCreationAttributes> implements IGoodsSaleHistory {
  declare id: number;
  declare goodsId: number;
  declare price: number;
  declare stockChanges: number;
  declare timestamp: Date;
}

export const goodsSaleHistoryModelName = "GoodsSaleHistory";
export const goodsSaleHistoryModelAttrib: ModelAttributes<GoodsSaleHistory> = {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  goodsId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: goodsModelName,
      key: "id",
    },
  },
  price: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
  stockChanges: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  timestamp: {
    type: DataTypes.TIME,
    allowNull: false,
  },
};
