import { ErrorCodes } from "@myboothmanager/common";
import { HttpStatus } from "@nestjs/common";
import BaseHttpException from "@/lib/exceptions";

export class FairPassedException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.FAIR_PASSED, HttpStatus.NOT_ACCEPTABLE);
  }
}

export class FairInfoUpdateFailedException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.FAIR_INFO_UPDATE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
