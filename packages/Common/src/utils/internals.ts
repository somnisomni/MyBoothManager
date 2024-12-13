interface ISequelizeInternals {
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * Type: Internal keys that are automatically added and managed by Sequelize.
 */
export type SequelizeInternalKeys = "createdAt" | "updatedAt" | "deletedAt";

/**
 * Array: Internal keys that are automatically added and managed by Sequelize.
 */
export const SEQUELIZE_INTERNAL_KEYS = [ "createdAt", "updatedAt", "deletedAt" ];

/**
 * Helper type to include Sequelize internal keys to a data model interface.
 */
export type WithSequelizeInternals<T> = T & ISequelizeInternals;

export function deleteSequelizeInternalKeys<T>(dataModelObj: T & Partial<ISequelizeInternals>): T {
  const newObj = { ...dataModelObj } as unknown as Record<string, unknown>;

  for(const key of SEQUELIZE_INTERNAL_KEYS) {
    newObj[key] = undefined;

    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete newObj[key];
  }

  return newObj as T;
}
