import { BoothStatus, type IBoothModel, IBoothExpense, IBoothCreateRequest, IBoothResponse, IBoothAdminResponse } from "@myboothmanager/common";
import { DataTypes } from "sequelize";
import { Model, AllowNull, AutoIncrement, BelongsTo, Column, Default, ForeignKey, HasMany, PrimaryKey, Table, Unique, DefaultScope } from "sequelize-typescript";
import Account from "./account";
import GoodsCategory from "./goods-category";
import GoodsOrder from "./goods-order";
import UploadStorage from "./uploadstorage";
import Goods from "./goods";
import GoodsCombination from "./goods-combination";
import BoothMember from "./booth-member";

@Table
@DefaultScope(() => ({
  include: [{
    as: "bannerImage",
    model: UploadStorage,
  }, {
    as: "infoImage",
    model: UploadStorage,
  }],
}))
export default class Booth extends Model<IBoothModel, IBoothCreateRequest> implements IBoothModel {
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
  declare statusContentPublished?: boolean;

  @AllowNull
  @Default(null)
  @ForeignKey(() => UploadStorage)
  @Column(DataTypes.INTEGER.UNSIGNED)
  declare bannerImageId?: number | null;

  @AllowNull
  @Default(null)
  @ForeignKey(() => UploadStorage)
  @Column(DataTypes.JSON)
  declare infoImageId?: number | null;


  /* === Relations === */
  @BelongsTo(() => Account)
  declare ownerAccount: Account;

  @HasMany(() => Goods)
  declare goods: Goods[];

  @HasMany(() => GoodsCategory)
  declare goodsCategories: GoodsCategory[];

  @HasMany(() => GoodsOrder)
  declare goodsOrders: GoodsOrder[];

  @HasMany(() => GoodsCombination)
  declare goodsCombinations: GoodsCombination[];

  @HasMany(() => BoothMember)
  declare boothMembers: BoothMember[];

  @BelongsTo(() => UploadStorage, "bannerImageId")
  declare bannerImage?: UploadStorage;

  @BelongsTo(() => UploadStorage, "infoImageId")
  declare infoImage?: UploadStorage;


  /* === Functions === */
  getResponseForPublic(): IBoothResponse {
    const thisGet = this.get();

    const output: IBoothResponse = {
      id: thisGet.id,
      ownerId: thisGet.ownerId,
      name: thisGet.name,
      description: thisGet.description,
      location: thisGet.location,
      boothNumber: thisGet.boothNumber,
      currencySymbol: thisGet.currencySymbol,
      dateOpen: thisGet.dateOpen,
      dateClose: thisGet.dateClose,
      status: {
        status: thisGet.status,
        reason: thisGet.statusReason ?? undefined,
        contentPublished: thisGet.statusContentPublished ?? undefined,
      },
      bannerImage: thisGet.bannerImageId ? this.bannerImage?.toImageUploadInfo() : undefined,
      infoImage: thisGet.infoImageId ? this.infoImage?.toImageUploadInfo() : undefined,
    };

    return output;
  }

  getResponseForAdmin(): IBoothAdminResponse {
    const output = this.getResponseForPublic();

    return {
      ...output,
      expenses: this.get("expenses"),
    };
  }
}
