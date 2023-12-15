import type { InternalKeysWithId } from "@/lib/types";
import { BoothStatus, IBoothMember, type IBoothModel, IBoothExpense } from "@myboothmanager/common";
import { DataTypes } from "sequelize";
import { Model, AllowNull, AutoIncrement, BelongsTo, Column, Default, ForeignKey, HasMany, PrimaryKey, Table, Unique } from "sequelize-typescript";
import Account from "./account";
import GoodsCategory from "./goods-category";
import GoodsOrder from "./goods-order";
import UploadStorage from "./uploadstorage";

export type BoothCreationAttributes = Omit<IBoothModel, InternalKeysWithId | "description" | "boothNumber" | "status" | "statusReason" | "statusPublishContent" | "members" | "expenses" | "bannerImageId" | "infoImageId">
                               & Partial<Pick<IBoothModel, "description" | "boothNumber" | "status" | "statusReason" | "statusPublishContent" | "members" | "expenses" | "bannerImageId" | "infoImageId">>;

@Table
export default class Booth extends Model<IBoothModel, BoothCreationAttributes> implements IBoothModel {
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

  @AllowNull(false)
  @Column(DataTypes.STRING(256))
  declare name: string;

  @AllowNull
  @Default(null)
  @Column(DataTypes.STRING(1024))
  declare description?: string;

  @AllowNull(false)
  @Column(DataTypes.STRING(512))
  declare location: string;

  @AllowNull
  @Default(null)
  @Column(DataTypes.STRING(1024))
  declare boothNumber?: string;

  @AllowNull(false)
  @Default("₩")
  @Column(DataTypes.STRING(8))
  declare currencySymbol: string;

  @AllowNull(false)
  @Default([])
  @Column(DataTypes.JSON)
  declare members: IBoothMember[];

  @AllowNull(false)
  @Default([])
  @Column(DataTypes.JSON)
  declare expenses: IBoothExpense[];

  @AllowNull(false)
  @Column(DataTypes.DATEONLY)
  declare dateOpen: Date;

  @AllowNull(false)
  @Column(DataTypes.DATEONLY)
  declare dateClose: Date;

  @AllowNull(false)
  @Default(BoothStatus.PREPARE)
  @Column(DataTypes.ENUM(...Object.values(BoothStatus)))
  declare status: BoothStatus;

  @AllowNull
  @Default(null)
  @Column(DataTypes.STRING(1024))
  declare statusReason?: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataTypes.BOOLEAN)
  declare statusPublishContent?: boolean;

  @AllowNull
  @Default(null)
  @ForeignKey(() => UploadStorage)
  @Column(DataTypes.INTEGER.UNSIGNED)
  declare bannerImageId?: number | null;

  @Column(DataTypes.VIRTUAL)
  get bannerImageUrl(): string | null {
    if(this.bannerImage) {
      return this.bannerImage.filePath;
    } else {
      return null;
    }
  }

  @AllowNull
  @Default([])
  @ForeignKey(() => UploadStorage)
  @Column(DataTypes.JSON)
  declare infoImageId?: number | null;

  @Column(DataTypes.VIRTUAL)
  get infoImageUrl(): string | null {
    if(this.infoImage) {
      return this.infoImage.filePath;
    } else {
      return null;
    }
  }


  /* === Relations === */
  @BelongsTo(() => Account)
  declare ownerAccount: Account;

  @HasMany(() => GoodsCategory)
  declare goodsCategories: GoodsCategory[];

  @HasMany(() => GoodsOrder)
  declare goodsOrders: GoodsOrder[];

  @BelongsTo(() => UploadStorage, "bannerImageId")
  declare bannerImage?: UploadStorage;

  @BelongsTo(() => UploadStorage, "infoImageId")
  declare infoImage?: UploadStorage;
}
