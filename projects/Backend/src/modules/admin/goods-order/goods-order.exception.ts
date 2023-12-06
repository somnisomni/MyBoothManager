import { ErrorCodes } from "@myboothmanager/common";
import { HttpStatus } from "@nestjs/common";
import BaseHttpException from "@/lib/exceptions";

export class GoodsOrderParentBoothNotFoundException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.GOODS_ORDER_PARENT_BOOTH_NOT_FOUND, HttpStatus.FORBIDDEN);
  }
}

export class GoodsOrderCreateOrderEmptyException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.GOODS_ORDER_INVALID_CREATE_REQUEST_ORDER_EMPTY, HttpStatus.BAD_REQUEST);
  }
}

export class GoodsOrderCreateGoodsNotFoundException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.GOODS_ORDER_INVALID_CREATE_REQUEST_GOODS_NOT_FOUND, HttpStatus.BAD_REQUEST);
  }
}

export class GoodsOrderCreateInvalidGoodsAmountException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.GOODS_ORDER_INVALID_CREATE_REQUEST_INVALID_GOODS_AMOUNT, HttpStatus.BAD_REQUEST);
  }
}

export class GoodsOrderStatusUpdateFailedException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.GOODS_ORDER_STATUS_UPDATE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class GoodsOrderStatusUpdateProhibitedException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.GOODS_ORDER_STATUS_UPDATE_PROHIBITED, HttpStatus.FORBIDDEN);
  }
}
