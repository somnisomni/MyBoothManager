import { ClassSerializerInterceptor, Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { BoothStatus } from "@myboothmanager/common";
import { GoodsResponseDto } from "../goods/dto/goods.dto";
import { GoodsCombinationResponseDto } from "../goods-combination/dto/goods-combination.dto";
import { GoodsCategoryResponseDto } from "../goods-category/dto/goods-category.dto";
import { PublicBoothService } from "./booth.service";
import { BoothResponseDto } from "./dto/booth.dto";

@Controller("/public/booth")
export class PublicBoothController {
  constructor(private readonly publicBoothService: PublicBoothService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(): Promise<Array<BoothResponseDto>> {
    return (await this.publicBoothService.findAll())
      .filter((booth) => (booth.status !== BoothStatus.CLOSE) && !(booth.status === BoothStatus.PREPARE && !booth.statusPublishContent))
      .map((booth) => new BoothResponseDto(booth.get()));
  }

  @Get("count")
  async countAll() {
    return await this.publicBoothService.countAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: string): Promise<BoothResponseDto> {
    return new BoothResponseDto((await this.publicBoothService.findOne(+id)).get());
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id/goods")
  async findAllBoothGoods(@Param("id") boothId: string): Promise<Array<GoodsResponseDto>> {
    return (await this.publicBoothService.findAllGoodsOfBooth(+boothId))
      .map((goods) => new GoodsResponseDto(goods.getForPublic()));
  }

  @Get(":id/goods/count")
  async countAllBoothGoods(@Param("id") boothId: string) {
    return await this.publicBoothService.countAllGoodsOfBooth(+boothId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id/goods/category")
  async findAllBoothGoodsCategory(@Param("id") boothId: string): Promise<Array<GoodsCategoryResponseDto>> {
    return (await this.publicBoothService.findAllGoodsCategoryOfBooth(+boothId))
      .map((category) => new GoodsCategoryResponseDto(category.get()));
  }

  @Get(":id/goods/category/count")
  async countAllBoothGoodsCategory(@Param("id") boothId: string) {
    return await this.publicBoothService.countAllGoodsCategoryOfBooth(+boothId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id/goods/combination")
  async findAllBoothGoodsCombination(@Param("id") boothId: string): Promise<Array<GoodsCombinationResponseDto>> {
    return (await this.publicBoothService.findAllGoodsCombinationOfBooth(+boothId))
      .map((combination) => new GoodsCombinationResponseDto(combination.getForPublic()));
  }

  @Get(":id/goods/combination/count")
  async countAllBoothGoodsCombination(@Param("id") boothId: string) {
    return await this.publicBoothService.countAllGoodsCombinationOfBooth(+boothId);
  }
}
