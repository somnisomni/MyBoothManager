import { All, Controller, Get, HttpCode, NotFoundException } from "@nestjs/common";
import { HTTP_HEALTH_CHECK_STATUS_CODE, SUCCESS_RESPONSE } from "@myboothmanager/common";

@Controller()
export class RootController {
  constructor() { }

  @All()
  routeNotFound() {
    throw new NotFoundException();
  }

  @Get("/healthcheck")
  @HttpCode(HTTP_HEALTH_CHECK_STATUS_CODE)
  healthCheck() {
    return SUCCESS_RESPONSE;
  }
}
