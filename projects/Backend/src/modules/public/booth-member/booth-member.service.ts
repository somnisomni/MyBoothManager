import { Injectable } from "@nestjs/common";
import { IValueResponse, SEQUELIZE_INTERNAL_KEYS } from "@myboothmanager/common";
import BoothMember from "@/db/models/booth-member";
import { EntityNotFoundException } from "@/lib/exceptions";

@Injectable()
export class PublicBoothMemberService {
  async findOne(boothId: number, id: number): Promise<BoothMember> {
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

  async findAll(boothId: number): Promise<Array<BoothMember>> {
    return await BoothMember.findAll({
      where: { boothId },
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });
  }

  async countAll(boothId: number): Promise<IValueResponse> {
    return { value: await BoothMember.count({ where: { boothId } }) };
  }
}
