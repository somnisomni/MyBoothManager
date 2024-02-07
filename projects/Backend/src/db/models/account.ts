import type { InternalKeysWithId } from "@/lib/types";
import type { IAccount } from "@myboothmanager/common";
import { DataTypes } from "sequelize";
import { Model, Table, PrimaryKey, Unique, AutoIncrement, Column, HasMany, Default, AllowNull } from "sequelize-typescript";
import Booth from "./booth";
import UploadStorage from "./uploadstorage";

export type AccountCreationAttributes = Omit<IAccount, InternalKeysWithId | "loginCount" | "lastLoginAt">;

@Table
export default class Account extends Model<IAccount, AccountCreationAttributes> implements IAccount {
  @PrimaryKey
  @Unique
  @AutoIncrement
  @AllowNull(false)
  @Column(DataTypes.INTEGER.UNSIGNED)
  declare id: number;

  @AllowNull(false)
  @Column(DataTypes.STRING(64))
  declare name: string;

  @Unique
  @AllowNull(false)
  @Column(DataTypes.STRING(256))
  declare loginId: string;

  @AllowNull(false)
  @Column(DataTypes.STRING(256))
  declare loginPassHash: string;

  @AllowNull(false)
  @Default(0)
  @Column(DataTypes.INTEGER.UNSIGNED)
  declare loginCount: number;

  @AllowNull(false)
  @Default(DataTypes.NOW)
  @Column(DataTypes.DATE)
  declare lastLoginAt: Date;

  @AllowNull
  @Default(null)
  @Column(DataTypes.INTEGER.UNSIGNED)
  declare lastSelectedBoothId?: number;


  /* === Relations === */
  @HasMany(() => Booth)
  declare booths: Booth[];

  @HasMany(() => UploadStorage)
  declare uploads: UploadStorage[];
}
