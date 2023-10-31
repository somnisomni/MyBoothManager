import { ErrorCodes, IBackendErrorResponse } from "@myboothmanager/common";
import { HttpException, HttpStatus } from "@nestjs/common";

export default class BaseHttpException extends HttpException implements IBackendErrorResponse {
  timestamp: string;
  path: string;
  statusCode: HttpStatus;
  errorCode: ErrorCodes;

  constructor(path: string, errorCode: ErrorCodes, status: HttpStatus) {
    super(errorCode.toString(), status);
    this.path = path;
    this.errorCode = errorCode;
    this.statusCode = status;
    this.timestamp = (new Date()).toISOString();
  }

  getResponse(): Record<string, unknown> {
    return {
      timestamp: this.timestamp,
      path: this.path,
      statusCode: this.statusCode,
      errorCode: this.errorCode,
    };
  }
}
