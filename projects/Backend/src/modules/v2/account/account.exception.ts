import { ErrorCodes } from "@myboothmanager/common";
import { HttpStatus } from "@nestjs/common";
import BaseHttpException from "@/lib/exceptions";

export class AccountInfoUpdateFailedException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.ACCOUNT_INFO_UPDATE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class AccountPasswordUpdateFailedException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.ACCOUNT_PASSWORD_UPDATE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
