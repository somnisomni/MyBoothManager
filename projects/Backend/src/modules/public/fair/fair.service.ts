import { Injectable } from "@nestjs/common";
import { SEQUELIZE_INTERNAL_KEYS } from "@myboothmanager/common";
import Fair from "@/db/models/fair";
import { findOneByPk } from "@/lib/common-functions";
import { FairPassedException } from "./fair.exception";

@Injectable()
export class PublicFairService {
  constructor() {}

  async findAll(includePassed: boolean = false): Promise<Array<Fair>> {
    const fairs = await Fair.findAll({
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });

    if(!includePassed) {
      return fairs.filter((fair) => !fair.isPassed);
    } else {
      return fairs;
    }
  }

  async findOne(id: number, includePassed: boolean = false): Promise<Fair> {
    const fair = await findOneByPk(Fair, id);

    if(!includePassed && fair.isPassed) {
      throw new FairPassedException();
    }

    return fair;
  }
}
