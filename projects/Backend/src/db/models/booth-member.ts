import { IBoothMemberModel } from "@myboothmanager/common";
import { Model, AllowNull, AutoIncrement, BelongsTo, Column, Default, DefaultScope, ForeignKey, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { DataTypes } from "sequelize";
import { InternalKeysWithId } from "@/lib/types";
import UploadStorage from "./uploadstorage";
import Booth from "./booth";

export type BoothMemberCreationAttributes = Omit<IBoothMemberModel, InternalKeysWithId | "descriptionShort" | "role" | "url" | "primaryColor" | "memberImageId">
                                           & Partial<Pick<IBoothMemberModel, "descriptionShort" | "role" | "url" | "primaryColor" | "memberImageId">>;
@Table
@DefaultScope(() => ({
  include: [
    {
      as: "memberImage",
      model: UploadStorage,
    },
  ],
}))
export default class BoothMember extends Model<IBoothMemberModel, BoothMemberCreationAttributes> implements IBoothMemberModel {
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
  declare memberImageId?: number | null;

  @Column(DataTypes.VIRTUAL)
  get memberImageUrl(): string | null {
    if(this.memberImage) {
      return this.memberImage.filePath;
    }
    return null;
  }

  @Column(DataTypes.VIRTUAL)
  get memberImageThumbnailData(): string | null {
    if(this.memberImage) {
      return this.memberImage.imageThumbnailBase64 ?? null;
    }
    return null;
  }


  /* === Relations === */
  @BelongsTo(() => Booth)
  declare ownerBooth: Booth;

  @BelongsTo(() => UploadStorage, "memberImageId")
  declare memberImage?: UploadStorage;
}
