import { ModelAttributes, Model, DataTypes } from "sequelize";
import { boothModelName } from "./booth";
import { goodsCategoryModelName } from "./goods-category";
import { GoodsStatus, IGoods } from "@myboothmanager/common";
import { InternalKeysWithId } from "@/lib/interface-omit";

type GoodsCreationAttributes = Omit<IGoods, InternalKeysWithId | "description" | "status" | "statusReason">
                               & Partial<Pick<IGoods, "description" | "status" | "statusReason">>;
export default class Goods extends Model<IGoods, GoodsCreationAttributes> implements IGoods {
  declare id: number;
  declare boothId: number;
  declare categoryId?: number;
  declare name: string;
  declare description?: string;
  declare status: GoodsStatus;
  declare statusReason?: string;
  declare price: number;
  declare stockInitial: number;
  declare stockRemaining: number;
}

const goodsModelName = "Goods";
const goodsModelAttrib: ModelAttributes<Goods> = {
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
  categoryId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    defaultValue: null,
    references: {
      model: goodsCategoryModelName,
      key: "id",
    },
  },
  name: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(1024),
    allowNull: true,
    defaultValue: null,
  },
  status: {
    type: DataTypes.ENUM(...Object.values(GoodsStatus)),
    allowNull: false,
    defaultValue: GoodsStatus.ON_SALE,
  },
  statusReason: {
    type: DataTypes.STRING(1024),
    allowNull: true,
    defaultValue: null,
  },
  price: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
  stockInitial: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
  stockRemaining: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
};

export { GoodsCreationAttributes, goodsModelName, goodsModelAttrib };
