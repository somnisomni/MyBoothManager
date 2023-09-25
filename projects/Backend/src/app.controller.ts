import { Controller, Delete, Get, Patch, Post, Put } from "@nestjs/common";
import { AppService } from "./app.service";
import { Public } from "./admin/auth/auth.guard";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public() /* WHY? */
  @Get()
  @Post()
  @Patch()
  @Put()
  @Delete()
  notFound() {
    this.appService.throwNotFoundException();
  }

  @Public() /* WHY???? */
  @Get("/teapot")
  teapot() {
    this.appService.throwTeapotException();
  }
}
