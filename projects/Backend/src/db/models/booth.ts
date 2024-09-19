import { BoothStatus, type IBoothModel, IBoothExpense, IBoothCreateRequest, SupportedCurrencyCodes, IBoothRelatedLink } from "@myboothmanager/common";
import { DataTypes } from "sequelize";
import { Model, AllowNull, AutoIncrement, BelongsTo, Column, Default, ForeignKey, HasMany, PrimaryKey, Table, Unique, DefaultScope } from "sequelize-typescript";
import { DateTime } from "luxon";
import Account from "./account";
import GoodsCategory from "./goods-category";
import GoodsOrder from "./goods-order";
import UploadStorage from "./uploadstorage";
import Goods from "./goods";
import GoodsCombination from "./goods-combination";
import BoothMember from "./booth-member";
import Fair from "./fair";

@Table
@DefaultScope(() => ({
  include: [{
    as: "associatedFair",
    model: Fair,
    nested: false,
  }, {
    as: "bannerImage",
    model: UploadStorage,
    nested: false,
  }, {
    as: "infoImage",
    model: UploadStorage,
    nested: false,
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

  @AllowNull
  @ForeignKey(() => Fair)
  @Column(DataTypes.INTEGER.UNSIGNED)
  declare fairId?: number | null;

  @AllowNull(false)
  @Column(DataTypes.STRING(256))
  declare name: string;

  @AllowNull(false)
  @Default("KRW")
  @Column(DataTypes.STRING(8))
  declare currencyCode: SupportedCurrencyCodes;

  @AllowNull
  @Default(null)
  @Column(DataTypes.STRING(1024))
  declare description?: string | null;

  @AllowNull
  @Default(null)
  @Column(DataTypes.STRING(512))
  declare location?: string | null;

  @AllowNull
  @Default(null)
  @Column(DataTypes.TEXT)
  declare noticeContent?: string | null;

  @AllowNull
  @Default(null)
  @Column(DataTypes.STRING(32))
  declare boothNumber?: string | null;

  @AllowNull
  @Default(null)
  @Column(DataTypes.DATEONLY)
  declare dateOpen?: Date | null;

  @AllowNull
  @Default(null)
  @Column(DataTypes.DATEONLY)
  declare dateClose?: Date | null;

  @AllowNull
  @Default(null)
  @Column(DataTypes.JSON)
  get datesOpenInFair(): Array<string> | null {
    return this.getDataValue("datesOpenInFair") ?? null;
  }
  set datesOpenInFair(value: Array<string> | Array<Date>) {
    const dateonlyArray = value.map((date) => DateTime.fromISO(new Date(date).toISOString()).toISODate()!);
    this.setDataValue("datesOpenInFair", Array.from(new Set(dateonlyArray)));
  }

  @AllowNull(false)
  @Default([])
  @Column(DataTypes.JSON)
  declare expenses: IBoothExpense[];

  @AllowNull(false)
  @Default(BoothStatus.PREPARE)
  @Column(DataTypes.ENUM(...Object.values(BoothStatus)))
  declare status: BoothStatus;

  @AllowNull
  @Default(null)
  @Column(DataTypes.STRING(1024))
  declare statusReason?: string | null;

  @AllowNull(false)
  @Default(false)
  @Column(DataTypes.BOOLEAN)
  declare statusContentPublished: boolean;

  @AllowNull(true)
  @Default([])
  @Column(DataTypes.JSON)
  declare relatedLinks: IBoothRelatedLink[];

  @AllowNull
  @Default(null)
  @ForeignKey(() => UploadStorage)
  @Column(DataTypes.INTEGER.UNSIGNED)
  declare bannerImageId?: number | null;

  @AllowNull
  @Default(null)
  @ForeignKey(() => UploadStorage)
  @Column(DataTypes.INTEGER.UNSIGNED)
  declare infoImageId?: number | null;


  /* === Relations === */
  @BelongsTo(() => Account, "ownerId")
  declare ownerAccount: Account;

  @BelongsTo(() => Fair, "fairId")
  declare associatedFair?: Fair;

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
}
