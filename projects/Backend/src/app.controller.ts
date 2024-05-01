import { Controller, Delete, Get, HttpCode, Patch, Post, Put } from "@nestjs/common";
import { HTTP_HEALTH_CHECK_STATUS_CODE, SUCCESS_RESPONSE } from "@myboothmanager/common";
import { AppService } from "./app.service";
import { Public } from "./modules/admin/auth/auth.guard";

@Public()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Post()
  @Patch()
  @Put()
  @Delete()
  notFound() {
    this.appService.throwNotFoundException();
  }

  @Get("/healthcheck")
  @HttpCode(HTTP_HEALTH_CHECK_STATUS_CODE)
  healthCheck() {
    return SUCCESS_RESPONSE;
  }
}
