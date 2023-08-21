import { Controller, Delete, Get, Patch, Post, Put } from "@nestjs/common";
import { AppService } from "./app.service";

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

  @Get("/teapot")
  teapot() {
    this.appService.throwTeapotException();
  }
}
