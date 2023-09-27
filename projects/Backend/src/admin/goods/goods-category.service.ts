import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { IStatusOKResponse, SEQUELIZE_INTERNAL_KEYS } from "@myboothmanager/common";
import GoodsCategory from "@/db/models/goods-category";
import { create, removeTarget } from "@/lib/common-functions";
import Booth from "@/db/models/booth";
import { CreateGoodsCategoryDTO } from "./dto/create-goods-category.dto";
import { UpdateGoodsCategoryDTO } from "./dto/update-goods-category.dto";

@Injectable()
export class GoodsCategoryService {
  async getGoodsCategoryAndParentBooth(categoryId: number, boothId: number, callerAccountId: number): Promise<{ booth: Booth, category: GoodsCategory }> {
    const category = await GoodsCategory.findByPk(categoryId, {
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });

    if(!category) throw new NotFoundException("굿즈 카테고리를 찾을 수 없습니다.");
    else if(category.boothId !== boothId) throw new BadRequestException("굿즈 카테고리에 대한 권한이 없습니다.");

    const booth = await Booth.findByPk(boothId);
    if(!booth) throw new ForbiddenException("접근 거부 - 굿즈가 소속된 부스를 찾을 수 없음");
    if(booth.ownerId !== callerAccountId) throw new ForbiddenException("접근 거부 - 굿즈가 소속된 부스에 대한 권한이 없음");

    return { booth, category };
  }

  async findGoodsCategoryBelongsToBooth(goodsId: number, boothId: number, callerAccountId: number): Promise<GoodsCategory> {
    const { category } = await this.getGoodsCategoryAndParentBooth(goodsId, boothId, callerAccountId);
    return category;
  }

  async create(createGoodsCategoryDto: CreateGoodsCategoryDTO): Promise<GoodsCategory> {
    return await create(GoodsCategory, createGoodsCategoryDto);
  }

  async findAll(boothId: number): Promise<Array<GoodsCategory>> {
    const where = boothId ? { boothId } : undefined;

    return await GoodsCategory.findAll({
      where,
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });
  }

  async findOne(id: number): Promise<GoodsCategory> {
    const category = await GoodsCategory.findByPk(id, {
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });

    if(!category) throw new BadRequestException("Goods category not found.");
    return category;
  }

  async updateInfo(id: number, updateGoodsCategoryDTO: UpdateGoodsCategoryDTO, callerAccountId: number) {
    let category = await this.findGoodsCategoryBelongsToBooth(id, updateGoodsCategoryDTO.boothId!, callerAccountId);

    try {
      await category.update({
        ...updateGoodsCategoryDTO,
        boothId: undefined,
      });
      category = await category.save();
    } catch(err) {
      throw new InternalServerErrorException("굿즈 정보를 수정할 수 없습니다.");
    }

    return category;
  }

  async remove(id: number): Promise<IStatusOKResponse> {
    const category = await this.findOne(id);
    return await removeTarget(category);
  }
}
