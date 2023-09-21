import { ModelAttributes, Model, DataTypes, IndexesOptions } from "sequelize";
import { type IGoodsCategory } from "@myboothmanager/common";
import { type InternalKeysWithId } from "@/lib/types";
import { goodsModelName } from "./goods";

export type GoodsCategoryCreationAttributes = Omit<IGoodsCategory, InternalKeysWithId>;
export default class GoodsCategory extends Model<IGoodsCategory, GoodsCategoryCreationAttributes> implements IGoodsCategory {
  declare id: number;
  declare boothId: number;
  declare name: string;
}

export const goodsCategoryModelName = "GoodsCategory";
export const goodsCategoryModelAttrib: ModelAttributes<GoodsCategory> = {
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
      model: goodsModelName,
      key: "id",
    },
  },
  name: {
    type: DataTypes.STRING(256),
    allowNull: false,
  },
};
export const goodsCategoryAdditionalUniqueIndex: IndexesOptions = {
  unique: true,
  fields: ["boothId", "name"],
};
