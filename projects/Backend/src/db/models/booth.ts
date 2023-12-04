import type { InternalKeysWithId } from "@/lib/types";
import { BoothStatus, IBoothMember, type IBooth, IBoothExpense } from "@myboothmanager/common";
import { DataTypes } from "sequelize";
import { Model, AllowNull, AutoIncrement, BelongsTo, Column, Default, ForeignKey, HasMany, PrimaryKey, Table, Unique } from "sequelize-typescript";
import Account from "./account";
import GoodsCategory from "./goods-category";
import GoodsOrder from "./goods-order";

export type BoothCreationAttributes = Omit<IBooth, InternalKeysWithId | "description" | "status" | "statusReason" | "statusPublishContent" | "members" | "expenses">
                               & Partial<Pick<IBooth, "description" | "status" | "statusReason" | "statusPublishContent" | "members" | "expenses">>;

@Table
export default class Booth extends Model<IBooth, BoothCreationAttributes> implements IBooth {
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
  @Column({ type: DataTypes.STRING(1024), defaultValue: null })
  declare description?: string;

  @AllowNull(false)
  @Column(DataTypes.STRING(512))
  declare location: string;

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


  /* === Relations === */
  @BelongsTo(() => Account)
  declare ownerAccount: Account;

  @HasMany(() => GoodsCategory)
  declare goodsCategories: GoodsCategory[];

  @HasMany(() => GoodsOrder)
  declare goodsOrders: GoodsOrder[];
}
