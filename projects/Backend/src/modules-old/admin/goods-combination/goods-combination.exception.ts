import { ErrorCodes } from "@myboothmanager/common";
import { HttpStatus } from "@nestjs/common";
import BaseHttpException from "@/lib/exceptions";

export class GoodsCombinationParentBoothNotFoundException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.GOODS_COMBINATION_PARENT_BOOTH_NOT_FOUND, HttpStatus.FORBIDDEN);
  }
}

export class GoodsCombinationInfoUpdateFailedException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.GOODS_COMBINATION_INFO_UPDATE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
