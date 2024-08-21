import { ClassSerializerInterceptor, Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { PublicGoodsResponseDto } from "../goods/dto/goods.dto";
import { PublicGoodsCombinationResponseDto } from "../goods-combination/dto/goods-combination.dto";
import { PublicGoodsCategoryResponseDto } from "../goods-category/dto/goods-category.dto";
import { PublicBoothService } from "./booth.service";
import { PublicBoothResponseDto } from "./dto/booth.dto";

@Controller("/public/booth")
export class PublicBoothController {
  constructor(private readonly publicBoothService: PublicBoothService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(): Promise<Array<PublicBoothResponseDto>> {
    return (await this.publicBoothService.findAllWithoutPassedFair())
      .map((booth) => new PublicBoothResponseDto(booth));
  }

  @Get("count")
  async countAll() {
    return await this.publicBoothService.countAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: string): Promise<PublicBoothResponseDto> {
    return new PublicBoothResponseDto(await this.publicBoothService.findOne(+id));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id/goods")
  async findAllBoothGoods(@Param("id") boothId: string): Promise<Array<PublicGoodsResponseDto>> {
    return (await this.publicBoothService.findAllGoodsOfBooth(+boothId))
      .map((goods) => new PublicGoodsResponseDto(goods));
  }

  @Get(":id/goods/count")
  async countAllBoothGoods(@Param("id") boothId: string) {
    return await this.publicBoothService.countAllGoodsOfBooth(+boothId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id/goods/category")
  async findAllBoothGoodsCategory(@Param("id") boothId: string): Promise<Array<PublicGoodsCategoryResponseDto>> {
    return (await this.publicBoothService.findAllGoodsCategoryOfBooth(+boothId))
      .map((category) => new PublicGoodsCategoryResponseDto(category));
  }

  @Get(":id/goods/category/count")
  async countAllBoothGoodsCategory(@Param("id") boothId: string) {
    return await this.publicBoothService.countAllGoodsCategoryOfBooth(+boothId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id/goods/combination")
  async findAllBoothGoodsCombination(@Param("id") boothId: string): Promise<Array<PublicGoodsCombinationResponseDto>> {
    return (await this.publicBoothService.findAllGoodsCombinationOfBooth(+boothId))
      .map((combination) => new PublicGoodsCombinationResponseDto(combination));
  }

  @Get(":id/goods/combination/count")
  async countAllBoothGoodsCombination(@Param("id") boothId: string) {
    return await this.publicBoothService.countAllGoodsCombinationOfBooth(+boothId);
  }
}
