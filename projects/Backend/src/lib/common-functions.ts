/* eslint-disable @typescript-eslint/no-explicit-any */

import { ISuccessResponse, SEQUELIZE_INTERNAL_KEYS, SUCCESS_RESPONSE } from "@myboothmanager/common";
import { InternalServerErrorException, BadRequestException } from "@nestjs/common";
import { BaseError, Model, ModelDefined, WhereOptions } from "sequelize";
import { EntityNotFoundException } from "./exceptions";

export async function findOneByPk<T extends Model<any, any>>(model: { new (): T }, pk: number, excludeSequelizeInternalKeys: boolean = true): Promise<T> {
  let target = null;

  try {
    target = await (model as unknown as ModelDefined<any, any>).findByPk(pk, {
      attributes: {
        exclude: excludeSequelizeInternalKeys ? SEQUELIZE_INTERNAL_KEYS : [],
      },
    });
  } catch(error) {
    console.error(error);

    if(error instanceof BaseError) {
      // DB error
      throw new InternalServerErrorException("DB 오류");
    } else {
      // Unknown error
      throw new BadRequestException();
    }
  }

  if(!target) throw new EntityNotFoundException();
  else return target as unknown as T;
}

export async function create<T extends Model<any, any>>(model: { new (): T }, dto: object, additionalParams?: Record<string, unknown>): Promise<T> {
  try {
    return await (model as unknown as ModelDefined<any, any>).create({
      ...dto,
      ...additionalParams,
    }) as unknown as T;
  } catch(error) {
    console.error(error);

    if(error instanceof BaseError) {
      // DB error
      throw new InternalServerErrorException("DB 오류");
    } else {
      // Unknown error
      throw new BadRequestException();
    }
  }
}

export async function removeTarget<T extends Model<any, any>>(model: T, ignoreParanoid: boolean = false): Promise<ISuccessResponse> {
  try {
    await model.destroy({ force: ignoreParanoid });
    await model.save();
  } catch(error) {
    console.error(error);

    throw new BadRequestException("삭제할 수 없습니다.");
  }

  return SUCCESS_RESPONSE;
}

export async function removeOne<T extends Model<any, any>>(model: { new (): T }, where: WhereOptions<T>, ignoreParanoid: boolean = false): Promise<ISuccessResponse> {
  try {
    const target = await (model as unknown as ModelDefined<any, any>).findAll({ where });
    if(target.length !== 1) throw new BadRequestException("삭제 대상이 하나가 아닙니다.");

    return await removeTarget(target[0], ignoreParanoid);
  } catch(error) {
    console.error(error);

    if(error instanceof BaseError) {
      // DB error
      throw new InternalServerErrorException("DB 오류");
    } else {
      // Unknown error
      throw new BadRequestException();
    }
  }
}
