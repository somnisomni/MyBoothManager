import { IFairCreateRequest, IFairInfo, IFairModel } from "@myboothmanager/common";
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
    const dateonlyArray = value.map((date) => DateTime.fromISO(new Date(date).toISOString()).toISODate()!).sort();
    this.setDataValue("openingDates", dateonlyArray);
  }

  @AllowNull
  @Default(null)
  @Column(DataTypes.STRING(512))
  declare websiteUrl?: string | null;

  @Column(DataTypes.VIRTUAL)
  get isPassed(): boolean {
    const parsedDates: Array<Date> = this.openingDates.map((date) => new Date(date));
    parsedDates.sort((a, b) => a.getTime() - b.getTime());

    const toDateonly = (date: string | Date) => DateTime.fromFormat(DateTime.fromJSDate(new Date(date)).toISODate()!, "yyyy-MM-dd");
    const lastDate: DateTime = toDateonly(parsedDates[parsedDates.length - 1]);
    const now: DateTime = toDateonly(new Date());

    return now > lastDate;
  }


  /* === Functions === */
  toFairInfo(): IFairInfo {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      location: this.location,
      websiteUrl: this.websiteUrl,
    };
  }

  /* === Relations === */
  @HasMany(() => Booth)
  declare booths: Booth[];
}
