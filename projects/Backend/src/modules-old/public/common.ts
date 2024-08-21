import { IBoothModel, BoothStatus } from "@myboothmanager/common";
import { WhereOptions, Op } from "sequelize";
import Booth from "@/db/models/booth";

export class PublicCommon {
  /**
   * Where options for checking if a booth is accessible.
   * > `!(status === PREPARE && statusContentPublished === false)`
   */
  public static readonly PUBLIC_BOOTH_WHERE_OPTIONS: WhereOptions<IBoothModel> = {
    [Op.not]: {
      [Op.and]: {
        status: BoothStatus.PREPARE,
        statusContentPublished: false,
      },
    },
  };

  /**
    Where options for ALL Booth query for public access. (not for single query)
    > `status !== CLOSE && PUBLIC_BOOTH_WHERE_OPTIONS`
  */
  public static readonly PUBLIC_ALL_BOOTH_WHERE_OPTIONS: WhereOptions<IBoothModel> = {
    [Op.and]: {
      status: { [Op.not]: BoothStatus.CLOSE },
      ...PublicCommon.PUBLIC_BOOTH_WHERE_OPTIONS,
    },
  };

  /**
   * Check if a booth is publicily accessible.
   * @param boothId Booth ID to check.
   * @returns `true` if the booth is unique and publicily accessible.
   */
  public static async isBoothPublicilyAccessible(boothId: number): Promise<boolean> {
    if(!boothId) return false;

    return (await Booth.count({
      where: {
        id: boothId,
        ...PublicCommon.PUBLIC_BOOTH_WHERE_OPTIONS,
      },
    })) === 1;
  }
}
