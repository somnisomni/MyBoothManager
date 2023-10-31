import { ErrorCodes } from "@myboothmanager/common";
import { HttpStatus } from "@nestjs/common";
import BaseHttpException from "@/lib/exceptions/base";

export class AuthTokenNeedRefreshException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.AUTH_TOKEN_NEED_REFRESH, HttpStatus.UNAUTHORIZED);
  }
}

export class LoginAccountNotFoundException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.ENTITY_NOT_FOUND, HttpStatus.UNAUTHORIZED);
  }
}

export class InvalidRefreshTokenException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.INVALID_REFRESH_TOKEN, HttpStatus.UNAUTHORIZED);
  }
}

export class UnauthorizedNoTokenException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.AUTH_TOKEN_MISSING, HttpStatus.UNAUTHORIZED);
  }
}

export class UnauthorizedNoAccessException extends BaseHttpException {
  constructor() {
    
  }
}
