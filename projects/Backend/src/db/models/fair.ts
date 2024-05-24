import { IFairCreateRequest, IFairModel } from "@myboothmanager/common";
import { DateTime } from "luxon";
import { DataTypes } from "sequelize";
import { AllowNull, AutoIncrement, Column, Default, HasMany, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import Booth from "./booth";

@Table
export default class Fair extends Model<IFairModel, IFairCreateRequest> implements IFairModel {
  @PrimaryKey
  @Unique
  @AutoIncrement
  @AllowNull(false)
  @Column(DataTypes.INTEGER.UNSIGNED)
  declare id: number;

  @AllowNull(false)
  @Column(DataTypes.STRING(128))
  declare name: string;

  @AllowNull
  @Default(null)
  @Column(DataTypes.STRING(1024))
  declare description?: string | null;

  @AllowNull(false)
  @Column(DataTypes.STRING(256))
  declare location: string;

  @AllowNull(false)
  @Default([])
  @Column(DataTypes.JSON)
  get openingDates(): Array<string> {
    return this.getDataValue("openingDates");
  }
  set openingDates(value: Array<string> | Array<Date>) {
    const dateonlyArray = value.map((date) => DateTime.fromISO(new Date(date).toISOString()).toISODate()!);
    this.setDataValue("openingDates", dateonlyArray);
  }

  @AllowNull
  @Default(null)
  @Column(DataTypes.STRING(512))
  declare websiteUrl?: string | null;


  /* === Relations === */
  @HasMany(() => Booth)
  declare booths: Booth[];
}
