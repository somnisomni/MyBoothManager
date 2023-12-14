import type { InternalKeysWithId } from "@/lib/types";
import type { IUploadStorage } from "@myboothmanager/common";
import { DataTypes } from "sequelize";
import { Model, AutoIncrement, BelongsTo, Column, ForeignKey, PrimaryKey, Table, Unique, AllowNull, Default, HasOne } from "sequelize-typescript";
import Account from "./account";
import Booth from "./booth";
import path from "path";

export type UploadStorageCreationAttributes = Omit<IUploadStorage, InternalKeysWithId>;

@Table
export default class UploadStorage extends Model<IUploadStorage, UploadStorageCreationAttributes> implements IUploadStorage {
  @PrimaryKey
  @Unique
  @AutoIncrement
  @AllowNull(false)
  @Column(DataTypes.INTEGER.UNSIGNED)
  declare id: number;

  @AllowNull(false)
  @ForeignKey(() => Account)
  @Column(DataTypes.INTEGER.UNSIGNED)
  declare ownerId: number;

  @AllowNull
  @Default("/")
  @Column(DataTypes.STRING(32))
  declare savePath?: string;

  @AllowNull(false)
  @Column(DataTypes.STRING(128))
  declare fileName: string;

  @Column(DataTypes.VIRTUAL)
  get filePath(): string {
    return path.join(this.savePath!, this.fileName);
  }


  /* === Relations === */
  @BelongsTo(() => Account)
  declare ownerAccount: Account;

  @HasOne(() => Booth, "bannerImageId")
  declare boothBannerImage?: Booth;
}
