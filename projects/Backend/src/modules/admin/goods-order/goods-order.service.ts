import { Injectable } from "@nestjs/common";
import { GoodsOrderStatus, ISuccessResponse, IValueResponse, SEQUELIZE_INTERNAL_KEYS, SUCCESS_RESPONSE } from "@myboothmanager/common";
import Booth from "@/db/models/booth";
import GoodsOrder from "@/db/models/goods-order";
import { create as createTarget, findOneByPk, removeTarget } from "@/lib/common-functions";
import { NoAccessException } from "@/lib/exceptions";
import { GoodsService } from "../goods/goods.service";
import { CreateGoodsOrderDTO } from "./dto/create-goods-order.dto";
import { GoodsOrderCreateGoodsNotFoundException, GoodsOrderCreateInvalidGoodsAmountException, GoodsOrderCreateOrderEmptyException, GoodsOrderParentBoothNotFoundException, GoodsOrderStatusUpdateFailedException, GoodsOrderStatusUpdateProhibitedException } from "./goods-order.exception";
import { UpdateGoodsOrderStatusDTO } from "./dto/update-goods-order-status.dto";

@Injectable()
export class GoodsOrderService {
  constructor(private goodsService: GoodsService) {}

  private async getGoodsOrderAndParentBooth(orderId: number, boothId: number, callerAccountId: number): Promise<{ order: GoodsOrder, booth: Booth }> {
    const order = await findOneByPk(GoodsOrder, orderId, [], false);
    if(order.boothId !== boothId) throw new NoAccessException();

    const booth = await Booth.findByPk(boothId);
    if(!booth) throw new GoodsOrderParentBoothNotFoundException();
    if(booth.ownerId !== callerAccountId) throw new NoAccessException();

    return { order, booth };
  }

  async findGoodsOrderBelongsToBooth(orderId: number, boothId: number, callerAccountId: number): Promise<GoodsOrder> {
    const { order } = await this.getGoodsOrderAndParentBooth(orderId, boothId, callerAccountId);
    return order;
  }

  async create(createGoodsOrderDto: CreateGoodsOrderDTO, callerAccountId: number): Promise<GoodsOrder> {
    if(!(await Booth.findOne({ where: { ownerId: callerAccountId } }))) {
      throw new GoodsOrderParentBoothNotFoundException();
    }

    // Check goods availability & build goods order entry
    if(!createGoodsOrderDto.order || createGoodsOrderDto.order.length <= 0) throw new GoodsOrderCreateOrderEmptyException();

    for(const order of createGoodsOrderDto.order) {
      // Check if goods exists
      const goods = await this.goodsService.findGoodsBelongsToBooth(order.gId, createGoodsOrderDto.boothId, callerAccountId);
      if(!goods) throw new GoodsOrderCreateGoodsNotFoundException();

      // Validate goods stock
      if(goods.stockRemaining < order.quantity) throw new GoodsOrderCreateInvalidGoodsAmountException();

      // Set price if not provided
      if(typeof order.price !== "number" && !order.price) order.price = goods.price;

      // Set goods name if not provided
      if(typeof order.name !== "string" && !order.name) order.name = goods.name;

      // If all good, update remaining stock count of the goods
      await goods.update({ stockRemaining: goods.stockRemaining - order.quantity });
    }

    return await createTarget(GoodsOrder, createGoodsOrderDto);
  }

  async updateStatus(orderId: number, boothId: number, updateGoodsOrderStatusDto: UpdateGoodsOrderStatusDTO, callerAccountId: number): Promise<ISuccessResponse> {
    const order = await this.findGoodsOrderBelongsToBooth(orderId, boothId, callerAccountId);

    /* Prohibit status update in some conditions */
    if(order.status === updateGoodsOrderStatusDto.status) {
      // If status is not changed, just return success response
      return SUCCESS_RESPONSE;
    }

    if(order.status === GoodsOrderStatus.CANCELED && updateGoodsOrderStatusDto.status === GoodsOrderStatus.RECORDED) {
      // Canceled -> Recorded is not allowed
      throw new GoodsOrderStatusUpdateProhibitedException();
    }

    /* Update order status */
    try {
      await order.update(updateGoodsOrderStatusDto);
      await order.save();
    } catch(err) {
      throw new GoodsOrderStatusUpdateFailedException();
    }

    /* Revert goods stock if canceled */
    if(updateGoodsOrderStatusDto.status === GoodsOrderStatus.CANCELED) {
      for(const orderItem of order.order) {
        try {
          const goods = await this.goodsService.findGoodsBelongsToBooth(orderItem.gId, boothId, callerAccountId);
          await goods.update({ stockRemaining: goods.stockRemaining + orderItem.quantity });
        } catch(e) {
          // Just ignore any goods-related exceptions and continue processing
          continue;
        }
      }
    }

    return SUCCESS_RESPONSE;
  }

  async findAll(boothId?: number): Promise<Array<GoodsOrder>> {
    const where = boothId ? { boothId } : undefined;

    return await GoodsOrder.findAll({
      where,
      attributes: {
        include: ["createdAt"],
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });
  }

  async countAll(boothId?: number): Promise<IValueResponse> {
    const where = boothId ? { boothId } : undefined;

    return { value: await GoodsOrder.count({ where }) };
  }

  async remove(id: number, boothId: number, callerAccountId: number): Promise<ISuccessResponse> {
    const goods = await this.findGoodsOrderBelongsToBooth(id, boothId, callerAccountId);
    return await removeTarget(goods);
  }
}
