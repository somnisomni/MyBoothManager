import { ErrorCodes } from "../enums/errors";

export interface IDataModelBase {}

export interface IBackendErrorResponseBase {
  statusCode: number;
  errorCode: ErrorCodes;
}

export interface IBackendErrorResponse extends IBackendErrorResponseBase {
  timestamp: string;
  path: string;
}

export interface ISuccessResponse { success: true; }
export const SUCCESS_RESPONSE: Readonly<ISuccessResponse> = Object.freeze({ success: true });

export interface IValueResponse  { value: number | string; }
