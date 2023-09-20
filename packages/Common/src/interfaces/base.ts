export interface IDataModelBase {}

export interface IBackendErrorResponse {
  message: string;
  timestamp: string;
  path: string;
  statusCode: number;
}

export type IStatusOKResponse = { status: "OK" };
export const STATUS_OK_RESPONSE: Readonly<IStatusOKResponse> = Object.freeze({ status: "OK" });
