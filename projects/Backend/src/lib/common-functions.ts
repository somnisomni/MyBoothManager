/* eslint-disable @typescript-eslint/no-explicit-any */

import { createHash, randomBytes } from "crypto";
import { ISuccessResponse, SEQUELIZE_INTERNAL_KEYS, SUCCESS_RESPONSE } from "@myboothmanager/common";
import { InternalServerErrorException, BadRequestException } from "@nestjs/common";
import { BaseError, Includeable, Model, ModelDefined, Transaction, WhereOptions } from "sequelize";
import { EntityNotFoundException } from "./exceptions";

/* === Sequelize model util functions === */
export async function findOneByPk<T extends Model<any, any>>(model: { new (): T }, pk: number, includeModels?: Includeable[], transaction?: Transaction, excludeSequelizeInternalKeys: boolean = true): Promise<T> {
  let target = null;

  try {
    target = await (model as unknown as ModelDefined<any, any>).findByPk(pk, {
      include: includeModels,
      attributes: {
        exclude: excludeSequelizeInternalKeys ? SEQUELIZE_INTERNAL_KEYS : [],
      },
      transaction,
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

export async function create<T extends Model<any, any>>(model: { new (): T }, dto: object, transaction?: Transaction, additionalParams?: Record<string, unknown>): Promise<T> {
  try {
    return await (model as unknown as ModelDefined<any, any>).create({
      ...dto,
      ...additionalParams,
    }, { transaction }) as unknown as T;
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

export async function removeTarget<T extends Model<any, any>>(model: T, transaction?: Transaction, ignoreParanoid: boolean = false): Promise<ISuccessResponse> {
  try {
    await model.destroy({ force: ignoreParanoid, transaction });
    await model.save({ transaction });
  } catch(error) {
    console.error(error);

    throw new BadRequestException("삭제할 수 없습니다.");
  }

  return SUCCESS_RESPONSE;
}

export async function removeOne<T extends Model<any, any>>(model: { new (): T }, where: WhereOptions<T>, transaction?: Transaction, ignoreParanoid: boolean = false): Promise<ISuccessResponse> {
  try {
    const target = await (model as unknown as ModelDefined<any, any>).findAll({ where });
    if(target.length !== 1) throw new BadRequestException("삭제 대상이 하나가 아닙니다.");

    return await removeTarget(target[0], transaction, ignoreParanoid);
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

/* === Common util functions === */
export function generateRandomDigestFileName() {
  const digest = `${createHash("sha1").update(randomBytes(64)).digest("base64url")}`;

  return {
    fileName: digest,
    withExt(ext: string) {
      return `${this.fileName}.${ext}`;
    },
  };
}
