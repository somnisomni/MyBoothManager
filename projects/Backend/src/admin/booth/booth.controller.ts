import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { BoothService } from "./booth.service";
import { CreateBoothDTO } from "./dto/create-booth.dto";
import { UpdateBoothDTO } from "./dto/update-booth.dto";

@Controller("/admin/booth")
export class BoothController {
  constructor(private readonly boothService: BoothService) {}

  @Post()
  create(@Body() createAdminDto: CreateBoothDTO) {
    return this.boothService.create(1, createAdminDto);
  }

  @Get()
  async findAll() {
    return await this.boothService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.boothService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateAdminDto: UpdateBoothDTO) {
    return this.boothService.update(+id, updateAdminDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.boothService.remove(+id);
  }

  @Get(":id/goods")
  async findAllBoothGoods(@Param("id") boothId: string) {
    return await this.boothService.findAllBoothGoods(+boothId);
  }

  @Get(":id/goods/category")
  async findAllBoothGoodsCategory(@Param("id") boothId: string) {
    return await this.boothService.findAllBoothGoodsCategory(+boothId);
  }
}
