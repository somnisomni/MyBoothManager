import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { IStatusOKResponse, IValueResponse, SEQUELIZE_INTERNAL_KEYS } from "@myboothmanager/common";
import Booth from "@/db/models/booth";
import GoodsOrder from "@/db/models/goods-order";
import { create as createTarget, removeTarget } from "@/lib/common-functions";
import { CreateGoodsOrderDTO } from "./dto/create-goods-order.dto";

@Injectable()
export class GoodsOrderService {
  // constructor(private boothService: BoothService) {}

  private async getGoodsOrderAndParentBooth(orderId: number, boothId: number, callerAccountId: number): Promise<{ order: GoodsOrder, booth: Booth }> {
    const order = await GoodsOrder.findByPk(orderId);
    if(!order) throw new NotFoundException("굿즈 주문 내역을 찾을 수 없습니다.");
    if(order.boothId !== boothId) throw new BadRequestException("해당 굿즈 주문 내역은 해당 부스에 속해있지 않습니다.");

    const booth = await Booth.findByPk(boothId);
    if(!booth) throw new ForbiddenException("접근 거부 - 굿즈 주문 내역이 소속된 부스를 찾을 수 없음");
    if(booth.ownerId !== callerAccountId) throw new ForbiddenException("접근 거부 - 굿즈 주문 내역이 소속된 부스에 대한 권한이 없음");

    return { order, booth };
  }

  async findGoodsOrderBelongsToBooth(orderId: number, boothId: number, callerAccountId: number): Promise<GoodsOrder> {
    const { order } = await this.getGoodsOrderAndParentBooth(orderId, boothId, callerAccountId);
    return order;
  }

  async create(createGoodsOrderDto: CreateGoodsOrderDTO, callerAccountId: number): Promise<GoodsOrder> {
    if(!(await Booth.findOne({ where: { ownerId: callerAccountId } }))) {
      throw new ForbiddenException("굿즈가 소속될 부스를 찾을 수 없거나 권한이 없습니다.");
    }

    return await createTarget(GoodsOrder, createGoodsOrderDto);
  }

  async findAll(boothId?: number): Promise<Array<GoodsOrder>> {
    const where = boothId ? { boothId } : undefined;

    return await GoodsOrder.findAll({
      where,
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });
  }

  async countAll(boothId?: number): Promise<IValueResponse> {
    const where = boothId ? { boothId } : undefined;

    return { value: await GoodsOrder.count({ where }) };
  }

  async remove(id: number, boothId: number, callerAccountId: number): Promise<IStatusOKResponse> {
    const goods = await this.findGoodsOrderBelongsToBooth(id, boothId, callerAccountId);
    return await removeTarget(goods);
  }
}
