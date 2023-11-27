import { Injectable } from "@nestjs/common";
import { ISuccessResponse, SUCCESS_RESPONSE } from "@myboothmanager/common";
import Booth from "@/db/models/booth";
import GoodsOrder from "@/db/models/goods-order";
import { create, removeTarget } from "@/lib/common-functions";
import { EntityNotFoundException, NoAccessException } from "@/lib/exceptions";
import { PublicBoothService } from "@/modules/public/booth/booth.service";
import { GoodsOrderService } from "../goods-order/goods-order.service";
import { UpdateBoothDTO } from "./dto/update-booth.dto";
import { CreateBoothDTO } from "./dto/create-booth.dto";
import { UpdateBoothStatusDTO } from "./dto/update-booth-status.dto";
import { BoothInfoUpdateFailedException, BoothStatusUpdateFailedException } from "./booth.exception";

@Injectable()
export class BoothService {
  constructor(
    private readonly goodsOrderService: GoodsOrderService,
    private readonly publicBoothService: PublicBoothService,
  ) {}

  async findBoothBelongsToAccount(boothId: number, accountId: number): Promise<Booth> {
    const booth = await this.publicBoothService.findOne(boothId);

    if(!booth) throw new EntityNotFoundException();
    else if(booth.ownerId !== accountId) throw new NoAccessException();
    else return booth;
  }

  async create(createBoothDto: CreateBoothDTO, ownerId: number): Promise<Booth> {
    return await create(Booth, createBoothDto, { ownerId });
  }

  async findAllGoodsOrderOfBooth(boothId: number, callerAccountId: number): Promise<Array<GoodsOrder>> {
    // Throws error if the booth not found or not belongs to the account
    await this.findBoothBelongsToAccount(boothId, callerAccountId);

    return await this.goodsOrderService.findAll(boothId);
  }

  async updateBoothInfo(id: number, updateBoothDto: UpdateBoothDTO, callerAccountId: number): Promise<Booth> {
    let booth = await this.findBoothBelongsToAccount(id, callerAccountId);

    try {
      await booth.update(updateBoothDto);
      booth = await booth.save();
    } catch(err) {
      throw new BoothInfoUpdateFailedException();
    }

    return booth;
  }

  async updateBoothStatus(id: number, updateBoothStatusDto: UpdateBoothStatusDTO, callerAccountId: number): Promise<ISuccessResponse> {
    const booth = await this.findBoothBelongsToAccount(id, callerAccountId);

    try {
      await booth.update(updateBoothStatusDto);
      await booth.save();
    } catch(err) {
      throw new BoothStatusUpdateFailedException();
    }

    return SUCCESS_RESPONSE;
  }

  async remove(id: number, callerAccountId: number): Promise<ISuccessResponse> {
    const booth = await this.findBoothBelongsToAccount(id, callerAccountId);
    return await removeTarget(booth);
  }
}
