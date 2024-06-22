import { Injectable } from "@nestjs/common";
import { ISingleValueResponse, SEQUELIZE_INTERNAL_KEYS } from "@myboothmanager/common";
import BoothMember from "@/db/models/booth-member";
import { EntityNotFoundException } from "@/lib/exceptions";
import { PublicCommon } from "../common";
import { BoothNotPublishedException } from "../booth/booth.exception";

@Injectable()
export class PublicBoothMemberService {
  async findOne(boothId: number, id: number, isAdmin: boolean = false): Promise<BoothMember> {
    if(!isAdmin) {
      if(!await PublicCommon.isBoothPublicilyAccessible(boothId)) {
        throw new BoothNotPublishedException();
      }
    }

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
    if(!isAdmin) {
      if(!await PublicCommon.isBoothPublicilyAccessible(boothId)) {
        throw new BoothNotPublishedException();
      }
    }

    return await BoothMember.findAll({
      where: { boothId },
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });
  }

  async countAll(boothId: number): Promise<ISingleValueResponse<number>> {
    if(!await PublicCommon.isBoothPublicilyAccessible(boothId)) {
      throw new BoothNotPublishedException();
    }

    return { value: await BoothMember.count({ where: { boothId } }) };
  }
}
