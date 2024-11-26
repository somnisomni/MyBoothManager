/* eslint-disable @typescript-eslint/no-explicit-any */

import { SEQUELIZE_INTERNAL_KEYS } from "@myboothmanager/common";
import { InternalServerErrorException, BadRequestException } from "@nestjs/common";
import { type Model, fn, col, where, type ModelDefined, BaseError, type FindOptions, type CreateOptions, type InstanceDestroyOptions, type ModelAttributes } from "sequelize";
import type { Fn, Where } from "sequelize/types/utils";
import { EntityNotFoundException } from "../exceptions";

type FindOptionsAsParam<TAttr> = Partial<FindOptions<TAttr>> & { includeSequelizeInternalKeys?: boolean } & { attributes?: { exclude?: string[] } };
type CreateOptionsAsParam<TAttr> = Partial<CreateOptions<TAttr>> & { includeSequelizeInternalKeys?: boolean };

/* === Query builder functions === */
/**
 * Build a `JSON_CONTAINS` query
 *
 * @template TModel - Model type
 * @param column - Name of column that contains JSON
 * @param searchValue - Value to search
 * @returns {Fn} - Sequelize function
 */
export function jsonContains<TModel extends Model>(column: keyof TModel, searchValue: string | number): Fn {
  return fn("JSON_CONTAINS", col(column as string), searchValue.toString());
}

/**
 * Build a `BINARY` query for case-sensitive string comparison
 *
 * @template TModel - Model type
 * @param column - Name of column that contains string
 * @param searchValue - Value to search
 * @returns {Where} - Sequelize where clause
 */
export function stringCompareCaseSensitive<TModel extends Model>(column: keyof TModel, searchValue: string): Where {
  return where(fn("BINARY", col(column as string)), searchValue);
}

/* === Execution functions === */
/**
 * Wrapper function for handling Sequelize actions
 *
 * This is for convenient error handling and to reduce code duplication. This should not be exported and used directly.
 */
async function actionWrapper<TResult extends (Model | Model[])>(action: () => Promise<TResult | null>): Promise<TResult> {
  let target: TResult | null = null;

  try {
    target = await action();
  } catch(error) {
    console.error(error);

    if(error instanceof BaseError) {
      // DB error
      throw new InternalServerErrorException(`DB error: ${error.name}`);
    } else {
      // Unknown error
      throw new BadRequestException(`Unknown error: ${error instanceof Error ? error.name : "Unknwon"}`);
    }
  }

  if(!target) throw new EntityNotFoundException();
  return target;
}

/**
 * Find one record by primary key
 *
 * @template TModel - Model type
 * @param model - Model class
 * @param pk - Primary key to search
 * @param options - Additional options to be passed to Sequelize
 * @returns {Promise<TModel>} - Found record
 */
export async function findOneByPk<TModel extends Model>(
  model: { new (): TModel },
  pk: number,
  options: Omit<FindOptionsAsParam<TModel>, "where"> = { includeSequelizeInternalKeys: false }): Promise<TModel> {
  return await actionWrapper(async () => await (model as unknown as ModelDefined<any, any>).findByPk(pk, {
    ...options,

    attributes: {
      ...options.attributes,
      exclude: [
        ...(options.attributes?.exclude ?? []),
        ...(options.includeSequelizeInternalKeys ? [] : SEQUELIZE_INTERNAL_KEYS),
      ],
    },
  }) as TModel);
}

/**
 * Find all records matching the condition
 *
 * @template TModel - Model type
 * @param model - Model class
 * @param options - Additional options (including `where` clause) to be passed to Sequelize
 * @returns {Promise<TModel[]>} - Found records
 */
export async function findAll<TModel extends Model>(
  model: { new (): TModel },
  options: FindOptionsAsParam<TModel> = { includeSequelizeInternalKeys: false }): Promise<TModel[]> {
  return await actionWrapper(async () => await (model as unknown as ModelDefined<any, any>).findAll({
    ...options,

    attributes: {
      ...options.attributes,
      exclude: [
        ...(options.attributes?.exclude ?? []),
        ...(options.includeSequelizeInternalKeys ? [] : SEQUELIZE_INTERNAL_KEYS),
      ],
    },
  }) as TModel[]);
}

/**
 * Create a new record
 *
 * @template TModel - Model type
 * @param model - Model class
 * @param values - Data to be inserted
 * @param options - Additional options to be passed to Sequelize
 * @returns {Promise<TModel>} - Created record
 */
export async function create<TModel extends Model>(
  model: { new (): TModel },
  values: Partial<Record<keyof TModel["dataValues"], any>>,
  options: CreateOptionsAsParam<TModel> = { includeSequelizeInternalKeys: false }): Promise<TModel> {
  return await actionWrapper(async () => await (model as unknown as ModelDefined<any, any>).create({
    ...Object.fromEntries(
      Object.entries(values).filter(([key]) => {
        if(!options.includeSequelizeInternalKeys) {
          return !SEQUELIZE_INTERNAL_KEYS.some(internalKey => internalKey === key);
        }

        return true;
      }),
    ),
  }, { ...options }) as TModel);
}

/**
 * Remove specified single record(model instance)
 *
 * @template TModel - Model type
 * @param model - Model instance
 * @param options - Additional options to be passed to Sequelize
 * @returns {Promise<true>} - `true` if the record is successfully removed
 */
export async function removeInstance<TModel extends Model>(
  model: TModel,
  options?: InstanceDestroyOptions): Promise<true> {
  try {
    await model.destroy();
    await model.save({ transaction: options?.transaction });
  } catch(error) {
    console.error(error);

    throw new BadRequestException("Can't be deleted");
  }

  return true;
}

/**
 * Remove specified single record by primary key
 *
 * @template TModel - Model type
 * @param model - Model class
 * @param pk - Primary key to search
 * @param options - Additional options to be passed to Sequelize
 * @returns {Promise<true>} - `true` if the record is successfully removed
 */
export async function removeByPk<TModel extends Model>(
  model: { new (): TModel },
  pk: number,
  options?: InstanceDestroyOptions): Promise<true> {
  try {
    await (model as unknown as ModelDefined<any, any>).destroy({
      where: { [(model as unknown as ModelDefined<any, any>).primaryKeyAttribute]: pk },
      ...options,
    });
  } catch(error) {
    console.error(error);

    throw new BadRequestException("Can't be deleted");
  }

  return true;
}
