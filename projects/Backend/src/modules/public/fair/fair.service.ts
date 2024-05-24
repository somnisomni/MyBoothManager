import { Injectable } from "@nestjs/common";
import { DateTime } from "luxon";
import { SEQUELIZE_INTERNAL_KEYS } from "@myboothmanager/common";
import Fair from "@/db/models/fair";
import { findOneByPk } from "@/lib/common-functions";
import { FairPassedException } from "./fair.exception";

@Injectable()
export class PublicFairService {
  constructor() {}

  private checkFairPassed(fair: Fair): boolean {
    const parsedDates: Array<Date> = [];
    fair.openingDates.map((date) => parsedDates.push(new Date(date)));
    parsedDates.sort((a, b) => a.getTime() - b.getTime());

    const toDateonly = (date: string | Date) => DateTime.fromFormat(DateTime.fromJSDate(new Date(date)).toISODate()!, "yyyy-MM-dd");
    const lastDate: DateTime = toDateonly(parsedDates[parsedDates.length - 1]);
    const now: DateTime = toDateonly(new Date());

    return now > lastDate;
  }

  async findAll(excludePassed: boolean = true): Promise<Array<Fair>> {
    const fairs = await Fair.findAll({
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });

    if(excludePassed) {
      return fairs.filter((fair) => !this.checkFairPassed(fair));
    } else {
      return fairs;
    }
  }

  async findOne(id: number, excludePassed: boolean = true): Promise<Fair> {
    const fair = await findOneByPk(Fair, id);

    if(excludePassed && this.checkFairPassed(fair)) {
      throw new FairPassedException();
    }

    return fair;
  }
}
