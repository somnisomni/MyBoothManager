/**
 * Type: Internal keys that are automatically added and managed by Sequelize.
 */
export type SequelizeInternalKeys = "createdAt" | "updatedAt" | "deletedAt";

/**
 * Array: Internal keys that are automatically added and managed by Sequelize.
 */
export const SEQUELIZE_INTERNAL_KEYS = ["createdAt", "updatedAt", "deletedAt"];

/**
 * Helper type to include Sequelize internal keys to a data model interface.
 */
export type WithSequelizeInternals<T> = T & Record<SequelizeInternalKeys, Date>;
