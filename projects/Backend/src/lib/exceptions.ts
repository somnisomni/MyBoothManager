import { ErrorCodes, IBackendErrorResponse } from "@myboothmanager/common";
import { HttpException, HttpStatus } from "@nestjs/common";

export type IBackendException = Omit<IBackendErrorResponse, "path">;

export default class BaseHttpException extends HttpException implements IBackendException {
  timestamp: string;
  statusCode: HttpStatus;
  errorCode: ErrorCodes;

  constructor(errorCode: ErrorCodes, status: HttpStatus) {
    super(errorCode.toString(), status);
    this.errorCode = errorCode;
    this.statusCode = status;
    this.timestamp = (new Date()).toISOString();
  }

  getResponse(): IBackendException {
    return {
      timestamp: this.timestamp,
      statusCode: this.statusCode,
      errorCode: this.errorCode,
    };
  }
}

export class ApplicationUncaughtedException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class EntityNotFoundException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.ENTITY_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}

export class DuplicatedEntityException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.ENTITY_DUPLICATED, HttpStatus.CONFLICT);
  }
}

export class NoAccessException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.NO_ACCESS, HttpStatus.FORBIDDEN);
  }
}

export class InvalidRequestBodyException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.INVALID_REQUEST_BODY, HttpStatus.BAD_REQUEST);
  }
}
