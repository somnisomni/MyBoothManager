import { DataTypes, Model, ModelAttributes } from "sequelize";
import { type IAccount } from "@myboothmanager/common";
import { type InternalKeysWithId } from "@/lib/types";

type AccountCreationAttributes = Omit<IAccount, InternalKeysWithId | "loginCount" | "lastLoginAt">;
export default class Account extends Model<IAccount, AccountCreationAttributes> implements IAccount {
  declare id: number;
  declare name: string;
  declare loginId: string;
  declare loginPassHash: string;
  declare loginCount: number;
  declare lastLoginAt: Date;
}

const accountModelName = "Account";
const accountModelAttrib: ModelAttributes<Account> = {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  loginId: {
    type: DataTypes.STRING(256),
    allowNull: false,
    unique: true,
  },
  loginPassHash: {
    type: DataTypes.STRING(256),
    allowNull: false,
  },
  loginCount: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
};

export { AccountCreationAttributes, accountModelName, accountModelAttrib };
