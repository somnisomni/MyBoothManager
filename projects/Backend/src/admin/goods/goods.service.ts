import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateGoodsDTO } from "./dto/create-goods.dto";
import { UpdateGoodsDTO } from "./dto/update-goods.dto";
import Goods from "@/db/models/goods";
import { BaseError } from "sequelize";
import { IStatusOKResponse, IValueResponse, SEQUELIZE_INTERNAL_KEYS, STATUS_OK_RESPONSE } from "@myboothmanager/common";
import Booth from "@/db/models/booth";

@Injectable()
export class GoodsService {
  // constructor(private boothService: BoothService) {}

  private async getGoodsAndParentBooth(goodsId: number, boothId: number, callerAccountId: number): Promise<{ goods: Goods, booth: Booth }> {
    const goods = await Goods.findByPk(goodsId);
    if(!goods) throw new NotFoundException("굿즈를 찾을 수 없습니다.");
    if(goods.boothId !== boothId) throw new BadRequestException("해당 굿즈는 해당 부스에 속해있지 않습니다.");

    /*
    // The function in BoothService will throw errors on its own, No need to throw errors here.
    // this.boothService.findBoothBelongsToAccount(boothId, callerAccountId);

      * Circular dependency error; workaround to use Booth model directly
    */
    const booth = await Booth.findByPk(boothId);
    if(!booth) throw new ForbiddenException("접근 거부 - 굿즈가 소속된 부스를 찾을 수 없음");
    if(booth.ownerId !== callerAccountId) throw new ForbiddenException("접근 거부 - 굿즈가 소속된 부스에 대한 권한이 없음");

    return { goods, booth };
  }

  async findGoodsBelongsToBooth(goodsId: number, boothId: number, callerAccountId: number): Promise<Goods> {
    const { goods } = await this.getGoodsAndParentBooth(goodsId, boothId, callerAccountId);
    return goods;
  }

  async create(createGoodsDto: CreateGoodsDTO, callerAccountId: number): Promise<Goods> {
    if(!(await Booth.findOne({ where: { ownerId: callerAccountId } }))) {
      throw new ForbiddenException("굿즈가 소속될 부스를 찾을 수 없거나 권한이 없습니다.");
    }

    if(createGoodsDto.stockRemaining === undefined) {
      createGoodsDto.stockRemaining = createGoodsDto.stockInitial;
    }

    try {
      return await Goods.create(createGoodsDto);
    } catch(error) {
      if(error instanceof BaseError) {
        throw new InternalServerErrorException("DB 오류");
      } else {
        throw new BadRequestException();
      }
    }
  }

  async findAll(boothId?: number): Promise<Array<Goods>> {
    const where = boothId ? { boothId } : undefined;

    return await Goods.findAll({
      where,
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });
  }

  async countAll(boothId?: number): Promise<IValueResponse> {
    const where = boothId ? { boothId } : undefined;

    return { value: await Goods.count({ where }) };
  }

  update(id: number, updateGoodDto: UpdateGoodsDTO) {
    throw new BadRequestException("Goods update is not yet supported.");
  }

  async remove(id: number, boothId: number, callerAccountId: number): Promise<IStatusOKResponse> {
    const goods = await this.findGoodsBelongsToBooth(id, boothId, callerAccountId);

    try {
      await goods.destroy();
      await goods.save();
    } catch(err) {
      throw new InternalServerErrorException("굿즈를 삭제할 수 없습니다.");
    }

    return STATUS_OK_RESPONSE;
  }
}
