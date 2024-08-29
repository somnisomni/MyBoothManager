import { Injectable } from "@nestjs/common";
import { GoodsService } from "../goods/goods.service";
import { GoodsCombinationService } from "../goods-combination/goods-combination.service";
import GoodsOrder from "@/db/models/goods-order";
import Booth from "@/db/models/booth";
import { findOneByPk, create as commonCreate } from "@/lib/common-functions";
import { EntityNotFoundException, NoAccessException } from "@/lib/exceptions";
import { CacheMap } from "@/lib/types";
import { BoothService } from "../booth/booth.service";
import { BoothOrderParentBoothNotFoundException } from "./booth-order.exception";
import { CreateBoothOrderRequestDto } from "./dto/create.dto";
import { UpdateBoothOrderStatusRequestDto } from "./dto/update-status.dto";
import Goods from "@/db/models/goods";
import GoodsCombination from "@/db/models/goods-combination";
import MBMSequelize from "@/db/sequelize";
import { GoodsOrderParentBoothNotFoundException, GoodsOrderCreateOrderEmptyException, GoodsOrderCreateInvalidGoodsAmountException, GoodsOrderCreateGoodsNotFoundException, GoodsOrderCreateGoodsCombinationNotFoundException, GoodsOrderCreateInvalidGoodsCombinationException, GoodsOrderStatusUpdateProhibitedException, GoodsOrderStatusUpdateFailedException } from "@/modules-old/admin/goods-order/goods-order.exception";
import { IGoodsOrderItem, ISuccessResponse, SUCCESS_RESPONSE, GoodsOrderStatus, SEQUELIZE_INTERNAL_KEYS } from "@myboothmanager/common";

@Injectable()
export class BoothOrderService {
  constructor(
    private readonly booth: BoothService,
    private readonly goods: GoodsService,
    private readonly combination: GoodsCombinationService,
  ) { }

  private readonly orderBoothCache = new OrderBoothCache();
  /**
   * Gets the booth order entity and parent booth entity, and checks if the booth order belongs to the booth.
   * @param orderId ID of the booth order
   * @param boothId ID of the booth
   * @param accountId ID of the account which owns the booth. If omitted, the parent booth is not checked and `booth` becomes `undefined`.
   * @returns `BoothOrder` entity
   * @throws `NoAccessException` if the booth order does not belong to the booth or the booth does not belong to the account
   * @throws `EntityNotFoundException` if the booth order with the ID does not exist
   */
  private async getOrderAndParentBooth(orderId: number, boothId: number, accountId: number): Promise<{ order: GoodsOrder, booth?: Booth }> {
    if(!await this.orderBoothCache.testValue(orderId, boothId)) {
      throw new NoAccessException();
    }

    let booth: Booth | undefined;
    if(typeof accountId === "number") {
      try {
        booth = await this.booth.findOne(boothId, false, accountId);
      } catch(err) {
        if(err instanceof EntityNotFoundException) {
          // Change the error instance
          throw new BoothOrderParentBoothNotFoundException();
        }

        throw err;
      }
    }

    return {
      booth,
      order: await findOneByPk(GoodsOrder, orderId),
    };
  }

  async create(createDto: CreateBoothOrderRequestDto, boothId: number, accountId: number): Promise<GoodsOrder> {
    if(!(await Booth.findOne({ where: { ownerId: accountId } }))) {
      throw new GoodsOrderParentBoothNotFoundException();
    }

    // Check goods availability & build goods order entry
    if(!createDto.order || createDto.order.length <= 0) throw new GoodsOrderCreateOrderEmptyException();

    // Goods stock count process function
    const goodsProcessFn = async (goods: Goods, order: IGoodsOrderItem) => {
      // Validate goods stock
      if(goods.stockRemaining < order.quantity) throw new GoodsOrderCreateInvalidGoodsAmountException();

      // Set price if not provided
      if(typeof order.price !== "number" && !order.price) order.price = goods.price;

      // Set goods name if not provided
      if(typeof order.name !== "string" && !order.name) order.name = goods.name;

      // If all good, update remaining stock count of the goods
      await goods.update({ stockRemaining: goods.stockRemaining - order.quantity }, { transaction });
    };

    // START TRANSACTION
    const transaction = await MBMSequelize.createTransaction();
    try {
      for(const order of createDto.order) {
        if(order.gId) {
          // PROCESS FOR SINGLE GOODS

          // Not using GoodsService function for transaction
          // const goods = await this.goodsService.findGoodsBelongsToBooth(order.gId, createGoodsOrderDto.boothId, callerAccountId);

          const goods = await findOneByPk(Goods, order.gId, [], transaction);
          if(!goods) throw new GoodsOrderCreateGoodsNotFoundException();
          if(goods.boothId !== createDto.boothId) throw new NoAccessException();

          // Do process for single goods
          await goodsProcessFn(goods, order);
        } else if(order.cId) {
          // PROCESS FOR GOODS COMBINATION

          // Not using GoodsCombinationService function for transaction
          // const combination = await this.goodsCombinationService.findGoodsCombinationBelongsToBooth(order.cId, createGoodsOrderDto.boothId, callerAccountId);

          const combination = await findOneByPk(GoodsCombination, order.cId, [], transaction);
          if(!combination) throw new GoodsOrderCreateGoodsCombinationNotFoundException();
          if(combination.boothId !== createDto.boothId) throw new NoAccessException();

          // Validate goods combination
          if(!combination.combinedGoods || combination.combinedGoods.length < 2) throw new GoodsOrderCreateInvalidGoodsCombinationException();

          // Set price if not provided
          if(typeof order.price !== "number" && !order.price) order.price = combination.price;

          // Set goods name if not provided
          if(typeof order.name !== "string" && !order.name) order.name = combination.name;

          // Do process for each goods in combination
          for(const goods of combination.combinedGoods) {
            await goodsProcessFn(goods, order);

            if(!order.combinedGoods) order.combinedGoods = [];
            order.combinedGoods.push({ gId: goods.id, name: goods.name });
          }
        }
      }

      const created = await commonCreate(GoodsOrder, createDto, transaction);
      await transaction.commit();
      return created;
    } catch(err) {
      await transaction.rollback();
      throw err;
    }
  }

  async updateStatus(orderId: number, boothId: number, updateStatusDto: UpdateBoothOrderStatusRequestDto, accountId: number): Promise<ISuccessResponse> {
    const { order } = await this.getOrderAndParentBooth(orderId, boothId, accountId);

    /* Prohibit status update in some conditions */
    if(order.status === updateStatusDto.status) {
      // If status is not changed, just return success response
      return SUCCESS_RESPONSE;
    }

    if(order.status === GoodsOrderStatus.CANCELED && updateStatusDto.status === GoodsOrderStatus.RECORDED) {
      // Canceled -> Recorded is not allowed
      throw new GoodsOrderStatusUpdateProhibitedException();
    }

    /* Update order status */
    try {
      await order.update(updateStatusDto);
      await order.save();
    } catch(err) {
      throw new GoodsOrderStatusUpdateFailedException();
    }

    /* Revert goods stock if canceled */
    if(updateStatusDto.status === GoodsOrderStatus.CANCELED) {
      for(const orderItem of order.order) {
        if(orderItem.gId) {
          // PROCESS FOR SINGLE GOODS
          try {
            const goods = await this.goods.findGoodsBelongsToBooth(orderItem.gId, boothId, accountId);
            await goods.update({ stockRemaining: goods.stockRemaining + orderItem.quantity });
          } catch(e) {
            // Just ignore any goods-related exceptions and continue processing
            continue;
          }
        } else if(orderItem.cId) {
          // PROCESS FOR GOODS COMBINATION
          try {
            const combination = await this.combination.findGoodsCombinationBelongsToBooth(orderItem.cId, boothId, accountId);
            for(const goods of combination.combinedGoods) {
              await goods.update({ stockRemaining: goods.stockRemaining + orderItem.quantity });
            }
          } catch(e) {
            // Just ignore any goods-related exceptions and continue processing
            continue;
          }
        }
      }
    }

    return SUCCESS_RESPONSE;
  }

  async findOne(orderId: number, boothId: number, accountId: number): Promise<GoodsOrder> {
    return (await this.getOrderAndParentBooth(orderId, boothId, accountId)).order;
  }

  async findAll(boothId: number, accountId: number): Promise<GoodsOrder[]> {
    const where = boothId ? { boothId } : undefined;

    return await GoodsOrder.findAll({
      where,
      attributes: {
        include: ["createdAt"],
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });
  }
}

class OrderBoothCache extends CacheMap<number, number> {
  override async fetch(key: number): Promise<number> {
    const order = await findOneByPk(GoodsOrder, key);

    if(typeof order.boothId !== "number") throw new NoAccessException();

    return order.boothId;
  }
}
