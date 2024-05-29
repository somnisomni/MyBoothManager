import { GoodsStockVisibility, IGoodsCombinationCreateRequest, IGoodsCombinationModel } from "@myboothmanager/common";
import { DataTypes } from "sequelize";
import { Model, AllowNull, AutoIncrement, BelongsTo, Column, Default, ForeignKey, PrimaryKey, Table, Unique, HasMany, DefaultScope } from "sequelize-typescript";
import Booth from "./booth";
import GoodsCategory from "./goods-category";
import UploadStorage from "./uploadstorage";
import Goods from "./goods";

@Table
@DefaultScope(() => ({
  include: [
    { model: Goods, as: "combinedGoods" },
    { model: UploadStorage, as: "goodsImage" },
  ],
}))
export default class GoodsCombination extends Model<IGoodsCombinationModel, IGoodsCombinationCreateRequest> implements IGoodsCombinationModel {
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

  @AllowNull
  @Default(null)
  @ForeignKey(() => GoodsCategory)
  @Column(DataTypes.INTEGER.UNSIGNED)
  declare categoryId?: number | null;

  @AllowNull(false)
  @Column(DataTypes.STRING(128))
  declare name: string;

  @AllowNull
  @Default(null)
  @Column(DataTypes.STRING(1024))
  declare description?: string | null;

  @AllowNull(false)
  @Column(DataTypes.FLOAT.UNSIGNED)
  get price(): number { return parseFloat(this.getDataValue("price").toFixed(3)); }
  set price(value: number) { this.setDataValue("price", parseFloat(new Number(value).toFixed(3))); }

  @AllowNull(false)
  @Default(GoodsStockVisibility.SHOW_REMAINING_ONLY)
  @Column(DataTypes.ENUM(...Object.values(GoodsStockVisibility)))
  declare stockVisibility: GoodsStockVisibility;

  @Column(DataTypes.VIRTUAL)
  get stockInitial(): number {
    if(this.combinedGoods && this.combinedGoods.length > 0) {
      return Math.min(...this.combinedGoods.map(g => g.stockInitial));
    } else {
      return 0;
    }
  }

  @Column(DataTypes.VIRTUAL)
  get stockRemaining(): number {
    if(this.combinedGoods && this.combinedGoods.length > 0) {
      return Math.min(...this.combinedGoods.map(g => g.stockRemaining));
    } else {
      return 0;
    }
  }

  @Column(DataTypes.VIRTUAL)
  get ownerMemberIds(): Array<number> {
    if(this.combinedGoods && this.combinedGoods.length > 0) {
      return Array.from(new Set(this.combinedGoods.flatMap(g => (g.ownerMemberIds ?? []).flat())));
    } else {
      return [];
    }
  }

  @AllowNull
  @Default(null)
  @ForeignKey(() => UploadStorage)
  @Column(DataTypes.INTEGER.UNSIGNED)
  declare goodsImageId?: number | null;


  /* === Relations === */
  @BelongsTo(() => Booth)
  declare ownerBooth: Booth;

  @HasMany(() => Goods)
  declare combinedGoods: Goods[];

  @BelongsTo(() => GoodsCategory)
  declare assignedGoodsCategory?: GoodsCategory;

  @BelongsTo(() => UploadStorage, "goodsImageId")
  declare goodsImage?: UploadStorage;
}
