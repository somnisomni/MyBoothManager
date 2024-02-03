import { HttpStatus } from "@nestjs/common";
import { ErrorCodes } from "@myboothmanager/common";
import BaseHttpException from "./exceptions";

export class InvalidImageException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.INVALID_IMAGE, HttpStatus.BAD_REQUEST);
  }
}

export class ImageManipulationException extends BaseHttpException {
  constructor() {
    super(ErrorCodes.IMAGE_MANIPULATION_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
