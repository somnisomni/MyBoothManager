import { Injectable } from "@nestjs/common";
import { ISingleValueResponse, SEQUELIZE_INTERNAL_KEYS } from "@myboothmanager/common";
import BoothMember from "@/db/models/booth-member";
import { EntityNotFoundException } from "@/lib/exceptions";
import { PublicCommon } from "../common";

@Injectable()
export class PublicBoothMemberService {
  async findOne(boothId: number, id: number): Promise<BoothMember> {
    PublicCommon.throwIfBoothNotPublicilyAccessible(boothId);

    const member = await BoothMember.findOne({
      where: {
        id,
        boothId,
      },
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });

    if(!member) throw new EntityNotFoundException();
    else return member;
  }

  async findAll(boothId: number, isAdmin: boolean = false): Promise<Array<BoothMember>> {
    if(!isAdmin) PublicCommon.throwIfBoothNotPublicilyAccessible(boothId);

    return await BoothMember.findAll({
      where: { boothId },
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });
  }

  async countAll(boothId: number): Promise<ISingleValueResponse<number>> {
    PublicCommon.throwIfBoothNotPublicilyAccessible(boothId);

    return { value: await BoothMember.count({ where: { boothId } }) };
  }
}
