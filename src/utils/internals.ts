export type SequelizeInternalKeys = "createdAt" | "updatedAt" | "deletedAt";
export type OmitSequelizeInternals<T> = Omit<T, SequelizeInternalKeys>;
