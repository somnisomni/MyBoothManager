/* eslint-disable @typescript-eslint/no-empty-object-type */

import type { IFair } from "./fair";
import type { ErrorCodes } from "../enums/errors";

/* === Common Response Interfaces === */
export interface IErrorResponse {
  statusCode: number;
  errorCode: ErrorCodes;
  timestamp: string;
  path: string;
}

export interface ISuccessResponse {
  success: true;
}
export const SUCCESS_RESPONSE: Readonly<ISuccessResponse> = Object.freeze({ success: true } as const);

export interface ISingleValueResponse<T> {
  value: T;
}

/* === Common Nested Data Interfaces for Responses === */
export interface IImageUploadInfo {
  path: string;
  thumbnailData?: string | null;  // BASE64-encoded string
}

export interface IFairInfo extends Omit<IFair, "openingDates"> { }
