export type MutualExclusive<TInterface,
                            TKey1 extends keyof TInterface,
                            TKey2 extends keyof TInterface>
  = (Pick<TInterface, TKey1> & Omit<TInterface, TKey2>)
    | (Pick<TInterface, TKey2> & Omit<TInterface, TKey1>);

export { default as APICaller, MAX_UPLOAD_FILE_BYTES } from "./api-caller";
export * from "./currency-symbol";
export * from "./internals";
export * from "./functions";
