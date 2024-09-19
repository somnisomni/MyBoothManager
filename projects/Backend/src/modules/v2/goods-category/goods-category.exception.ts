import { ErrorCodes } from "@myboothmanager/common";
import { HttpStatus } from "@nestjs/common";
import BaseHttpException from "@/lib/exceptions";

export class GoodsCategoryParentBoothNotFoundException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.GOODS_CATEGORY_PARENT_BOOTH_NOT_FOUND, HttpStatus.FORBIDDEN);
  }
}

export class GoodsCategoryInfoUpdateFailedException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.GOODS_CATEGORY_INFO_UPDATE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
