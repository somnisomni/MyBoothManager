import { ErrorCodes } from "@myboothmanager/common";
import { HttpStatus } from "@nestjs/common";
import BaseHttpException from "@/lib/exceptions/base";

export class AccountNotFoundException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.ENTITY_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}
