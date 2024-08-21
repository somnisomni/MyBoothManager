import { Controller, Delete, Get, HttpCode, NotFoundException, Patch, Post, Put } from "@nestjs/common";
import { HTTP_HEALTH_CHECK_STATUS_CODE, SUCCESS_RESPONSE } from "@myboothmanager/common";

@Controller()
export class AppControllerV2 {
  constructor() { }

  @Get()
  @Post()
  @Patch()
  @Put()
  @Delete()
  routeNotFound() {
    throw new NotFoundException();
  }

  @Get("/healthcheck")
  @HttpCode(HTTP_HEALTH_CHECK_STATUS_CODE)
  healthCheck() {
    return SUCCESS_RESPONSE;
  }
}
