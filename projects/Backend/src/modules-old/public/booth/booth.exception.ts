import { ErrorCodes } from "@myboothmanager/common";
import { HttpStatus } from "@nestjs/common";
import BaseHttpException from "@/lib/exceptions";

export class BoothNotPublishedException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.BOOTH_NOT_PUBLISHED, HttpStatus.FORBIDDEN);
  }
}
