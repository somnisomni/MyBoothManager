import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from "@nestjs/common";
import { BoothService } from "./booth.service";
import { CreateBoothDTO } from "./dto/create-booth.dto";
import { UpdateBoothDTO } from "./dto/update-booth.dto";
import { DelayIntercepter } from "@/dev/delay-intercepter";

@UseInterceptors(DelayIntercepter)
@Controller("/admin/booth")
export class BoothController {
  constructor(private readonly adminService: BoothService) {}

  @Post()
  create(@Body() createAdminDto: CreateBoothDTO) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  async findAll() {
    return await this.adminService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.adminService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateAdminDto: UpdateBoothDTO) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.adminService.remove(+id);
  }
}
