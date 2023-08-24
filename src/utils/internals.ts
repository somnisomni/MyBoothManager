/**
 * Internal keys that are automatically added and managed by Sequelize.
 */
export type SequelizeInternalKeys = "createdAt" | "updatedAt" | "deletedAt";

/**
 * Helper type to omit Sequelize internal keys from an data model interface.
 */
export type OmitSequelizeInternals<T> = Omit<T, SequelizeInternalKeys>;
