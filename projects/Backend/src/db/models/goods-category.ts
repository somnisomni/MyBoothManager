import type { IGoodsCategoryCreateRequest, IGoodsCategoryModel } from "@myboothmanager/common";
import { DataTypes } from "sequelize";
import { Model, AutoIncrement, BelongsTo, Column, ForeignKey, PrimaryKey, Table, Unique, HasMany, AllowNull } from "sequelize-typescript";
import Booth from "./booth";
import Goods from "./goods";
import GoodsCombination from "./goods-combination";

@Table({
  indexes: [
    {
      unique: true,
      fields: ["boothId", "name"],
    },
  ],
})
export default class GoodsCategory extends Model<IGoodsCategoryModel, IGoodsCategoryCreateRequest> implements IGoodsCategoryModel {
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
  @Column(DataTypes.STRING(256))
  declare name: string;


  /* === Relations === */
  @BelongsTo(() => Booth)
  declare ownerBooth: Booth;

  @HasMany(() => Goods)
  declare goods: Goods[];

  @HasMany(() => GoodsCombination)
  declare goodsCombinations: GoodsCombination[];
}
