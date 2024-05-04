import type { IAccountCreateRequest, IAccountModel } from "@myboothmanager/common";
import { DataTypes } from "sequelize";
import { Model, Table, PrimaryKey, Unique, AutoIncrement, Column, HasMany, Default, AllowNull, AfterFind } from "sequelize-typescript";
import Booth from "./booth";
import UploadStorage from "./uploadstorage";

@Table
export default class Account extends Model<IAccountModel, IAccountCreateRequest> implements IAccountModel {
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

  @AllowNull
  @Default(null)
  @Column(DataTypes.DATE)
  declare lastLoginAt?: Date | null;

  @AllowNull
  @Default(null)
  @Column(DataTypes.INTEGER.UNSIGNED)
  declare lastSelectedBoothId?: number | null;


  /* === Relations === */
  @HasMany(() => Booth)
  declare booths: Booth[];

  @HasMany(() => UploadStorage)
  declare uploads: UploadStorage[];


  /* === Hooks === */
  @AfterFind
  static async setDefaultLastSelectedBoothId(instance: Account) {
    if(instance && !instance.lastSelectedBoothId) {
      const firstBooth = await Booth.findOne({ where: { ownerId: instance.id }, attributes: [ "id" ] });
      if(firstBooth) {
        instance.lastSelectedBoothId = firstBooth.id;
        await instance.save();
      }
    }
  }
}
