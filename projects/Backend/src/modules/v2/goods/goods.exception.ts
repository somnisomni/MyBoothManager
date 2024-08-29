import { ErrorCodes } from "@myboothmanager/common";
import { HttpStatus } from "@nestjs/common";
import BaseHttpException from "@/lib/exceptions";

export class GoodsParentBoothNotFoundException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.GOODS_PARENT_BOOTH_NOT_FOUND, HttpStatus.FORBIDDEN);
  }
}

export class GoodsStatusUpdateFailedException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.GOODS_STATUS_UPDATE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class GoodsInfoUpdateFailedException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.GOODS_INFO_UPDATE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
