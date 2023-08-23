export type InternalKeys = "createdAt" | "updatedAt" | "deletedAt";
export type InternalKeysWithId = InternalKeys | "id";
export type OmitInternals<T> = Omit<T, InternalKeys>;
