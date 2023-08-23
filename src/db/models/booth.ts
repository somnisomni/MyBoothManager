import { DataTypes, Model, ModelAttributes } from "sequelize";
import { accountModelName } from "./account";
import { BoothStatus, IBooth } from "myboothmanager-common/interfaces";
import { InternalKeysWithId } from "@/lib/interface-omit";

type BoothCreationAttributes = Omit<IBooth, InternalKeysWithId | "description" | "status" | "statusReason" | "statusPublishContent">
                               & Partial<Pick<IBooth, "description" | "status" | "statusReason" | "statusPublishContent">>;
export default class Booth extends Model<IBooth, BoothCreationAttributes> implements IBooth {
  declare id: number;
  declare ownerId: number;
  declare name: string;
  declare description?: string;
  declare location: string;
  declare currencySymbol: string;
  declare status: BoothStatus;
  declare statusReason?: string;
  declare statusPublishContent?: boolean;
}

const boothModelName = "Booth";
const boothModelAttrib: ModelAttributes<Booth> = {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  ownerId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: accountModelName,
      key: "id",
    },
  },
  name: {
    type: DataTypes.STRING(256),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(1024),
    allowNull: true,
    defaultValue: null,
  },
  location: {
    type: DataTypes.STRING(512),
    allowNull: false,
  },
  currencySymbol: {
    type: DataTypes.STRING(8),
    allowNull: false,
    defaultValue: "₩",
  },
  status: {
    type: DataTypes.ENUM(...Object.values(BoothStatus)),
    allowNull: false,
    defaultValue: BoothStatus.PREPARE,
  },
  statusReason: {
    type: DataTypes.STRING(1024),
    allowNull: true,
    defaultValue: null,
  },
  statusPublishContent: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
};

export { BoothCreationAttributes, boothModelName, boothModelAttrib };
