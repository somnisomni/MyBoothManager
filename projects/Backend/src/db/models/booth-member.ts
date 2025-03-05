import type { IBoothMemberCreateRequest, IBoothMemberModel } from "@myboothmanager/common";
import { DataTypes } from "sequelize";
import { Model, AllowNull, AutoIncrement, BelongsTo, Column, Default, DefaultScope, ForeignKey, PrimaryKey, Table, Unique } from "sequelize-typescript";
import Booth from "./booth";
import UploadStorage from "./uploadstorage";

@Table
@DefaultScope(() => {
  return ({
    include: [
      {
        as: "avatarImage",
        model: UploadStorage,
      },
    ],
  });
})
export default class BoothMember extends Model<IBoothMemberModel, IBoothMemberCreateRequest> implements IBoothMemberModel {
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
  @Column(DataTypes.STRING(128))
  declare name: string;

  @AllowNull
  @Default(null)
  @Column(DataTypes.STRING(256))
  declare descriptionShort?: string;

  @AllowNull
  @Default(false)
  @Column(DataTypes.STRING(128))
  declare role?: string;

  @AllowNull
  @Default(null)
  @Column(DataTypes.STRING(512))
  declare url?: string;

  @AllowNull
  @Default(null)
  @Column(DataTypes.STRING(32))
  declare primaryColor?: string;

  @AllowNull
  @Default(null)
  @ForeignKey(() => UploadStorage)
  @Column(DataTypes.INTEGER.UNSIGNED)
  declare avatarImageId?: number | null;

  /* === Relations === */
  @BelongsTo(() => Booth)
  declare ownerBooth: Booth;

  @BelongsTo(() => UploadStorage, "avatarImageId")
  declare avatarImage?: UploadStorage;
}
