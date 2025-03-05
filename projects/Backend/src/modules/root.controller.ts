import type { ISuccessResponse } from "@myboothmanager/common";
import { HTTP_HEALTH_CHECK_STATUS_CODE, SUCCESS_RESPONSE } from "@myboothmanager/common";
import { All, Controller, Get, HttpCode, NotFoundException } from "@nestjs/common";

@Controller()
export class RootController {
  @All()
  routeNotFound(): void {
    throw new NotFoundException();
  }

  @Get("/healthcheck")
  @HttpCode(HTTP_HEALTH_CHECK_STATUS_CODE)
  healthCheck(): ISuccessResponse {
    return SUCCESS_RESPONSE;
  }
}
