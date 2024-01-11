export type MutualExclusive<TInterface,
                            TKey1 extends keyof TInterface,
                            TKey2 extends keyof TInterface>
  =  (({ [key in TKey1]: TInterface[key] } & { [key in TKey2]?: never })
    | ({ [key in TKey2]: TInterface[key] } & { [key in TKey1]?: never }))
    & Omit<TInterface, TKey1 | TKey2>;

export { default as APICaller, MAX_UPLOAD_FILE_BYTES } from "./api-caller";
export * from "./currency-symbol";
export * from "./internals";
export * from "./functions";
