export type OmitInternals<T> = Omit<T, "createdAt" | "updatedAt" | "deletedAt">;
