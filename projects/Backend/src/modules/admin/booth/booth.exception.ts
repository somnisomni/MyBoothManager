import { ErrorCodes } from "@myboothmanager/common";
import { HttpStatus } from "@nestjs/common";
import BaseHttpException from "@/lib/exceptions";

export class BoothStatusUpdateFailedException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.BOOTH_STATUS_UPDATE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class BoothInfoUpdateFailedException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.BOOTH_INFO_UPDATE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class BoothMemberManipulationFailedException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.BOOTH_MEMBER_MANIPULATION_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
