/* eslint-disable @typescript-eslint/no-explicit-any */

import { InternalServerErrorException, BadRequestException } from "@nestjs/common";
import { BaseError, Model, ModelDefined } from "sequelize";

export async function create<T extends Model<any, any>>(model: { new (): T }, dto: object, additionalParams?: Record<string, unknown>): Promise<T> {
  try {
    return await (model as unknown as ModelDefined<any, any>).create({
      ...dto,
      ...additionalParams,
    }) as unknown as T;
  } catch(error) {
    if(error instanceof BaseError) {
      // DB error
      throw new InternalServerErrorException("DB 오류");
    } else {
      // Unknown error
      throw new BadRequestException();
    }
  }
}
