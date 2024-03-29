import { Controller, Get, Param } from "@nestjs/common";
import { PublicBoothService } from "./booth.service";

@Controller("/public/booth")
export class PublicBoothController {
  constructor(private readonly publicBoothService: PublicBoothService) {}

  @Get()
  async findAll() {
    return await this.publicBoothService.findAll();
  }

  @Get("count")
  async countAll() {
    return await this.publicBoothService.countAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.publicBoothService.findOne(+id);
  }

  @Get(":id/goods")
  async findAllBoothGoods(@Param("id") boothId: string) {
    return await this.publicBoothService.findAllGoodsOfBooth(+boothId);
  }

  @Get(":id/goods/count")
  async countAllBoothGoods(@Param("id") boothId: string) {
    return await this.publicBoothService.countAllGoodsOfBooth(+boothId);
  }

  @Get(":id/goods/category")
  async findAllBoothGoodsCategory(@Param("id") boothId: string) {
    return await this.publicBoothService.findAllGoodsCategoryOfBooth(+boothId);
  }

  @Get(":id/goods/category/count")
  async countAllBoothGoodsCategory(@Param("id") boothId: string) {
    return await this.publicBoothService.countAllGoodsCategoryOfBooth(+boothId);
  }

  @Get(":id/goods/combination")
  async findAllBoothGoodsCombination(@Param("id") boothId: string) {
    return await this.publicBoothService.findAllGoodsCombinationOfBooth(+boothId);
  }

  @Get(":id/goods/combination/count")
  async countAllBoothGoodsCombination(@Param("id") boothId: string) {
    return await this.publicBoothService.countAllGoodsCombinationOfBooth(+boothId);
  }
}
