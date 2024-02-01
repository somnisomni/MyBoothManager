import { ErrorCodes } from "@myboothmanager/common";
import { HttpStatus } from "@nestjs/common";
import BaseHttpException from "@/lib/exceptions";

export class BoothMemberParentBoothNotFoundException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.BOOTH_MEMBER_PARENT_BOOTH_NOT_FOUND, HttpStatus.FORBIDDEN);
  }
}

export class BoothMemberInfoUpdateFailedException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.BOOTH_MEMBER_INFO_UPDATE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
