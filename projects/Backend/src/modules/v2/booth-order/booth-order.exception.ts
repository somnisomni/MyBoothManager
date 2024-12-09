import { ErrorCodes } from "@myboothmanager/common";
import { HttpStatus } from "@nestjs/common";
import BaseHttpException from "@/lib/exceptions";

export class BoothOrderParentBoothNotFoundException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.GOODS_ORDER_PARENT_BOOTH_NOT_FOUND, HttpStatus.FORBIDDEN);
  }
}

export class BoothOrderCreateOrderEmptyException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.GOODS_ORDER_INVALID_CREATE_REQUEST_ORDER_EMPTY, HttpStatus.BAD_REQUEST);
  }
}

export class BoothOrderCreateGoodsNotFoundException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.GOODS_ORDER_INVALID_CREATE_REQUEST_GOODS_NOT_FOUND, HttpStatus.BAD_REQUEST);
  }
}

export class BoothOrderCreateInvalidGoodsAmountException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.GOODS_ORDER_INVALID_CREATE_REQUEST_INVALID_GOODS_AMOUNT, HttpStatus.BAD_REQUEST);
  }
}

export class BoothOrderCreateGoodsCombinationNotFoundException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.GOODS_ORDER_INVALID_CREATE_REQUEST_GOODS_COMBINATION_NOT_FOUND, HttpStatus.BAD_REQUEST);
  }
}

export class BoothOrderCreateInvalidGoodsCombinationException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.GOODS_ORDER_INVALID_CREATE_REQUEST_INVALID_GOODS_COMBINATION, HttpStatus.BAD_REQUEST);
  }
}

export class BoothOrderStatusUpdateFailedException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.GOODS_ORDER_STATUS_UPDATE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class BoothOrderStatusUpdateProhibitedException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.GOODS_ORDER_STATUS_UPDATE_PROHIBITED, HttpStatus.FORBIDDEN);
  }
}
