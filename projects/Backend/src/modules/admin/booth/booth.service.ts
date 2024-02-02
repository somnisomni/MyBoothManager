import { Injectable } from "@nestjs/common";
import { ISuccessResponse, IValueResponse, ImageSizeConstraintKey, SUCCESS_RESPONSE } from "@myboothmanager/common";
import { MultipartFile } from "@fastify/multipart";
import Booth from "@/db/models/booth";
import GoodsOrder from "@/db/models/goods-order";
import { create, findOneByPk, removeTarget } from "@/lib/common-functions";
import { EntityNotFoundException, NoAccessException } from "@/lib/exceptions";
import { PublicBoothService } from "@/modules/public/booth/booth.service";
import { GoodsOrderService } from "../goods-order/goods-order.service";
import { UtilService } from "../util/util.service";
import { UpdateBoothDTO } from "./dto/update-booth.dto";
import { CreateBoothDTO } from "./dto/create-booth.dto";
import { UpdateBoothStatusDTO } from "./dto/update-booth-status.dto";
import { BoothInfoUpdateFailedException, BoothStatusUpdateFailedException } from "./booth.exception";

@Injectable()
export class BoothService {
  constructor(
    private readonly goodsOrderService: GoodsOrderService,
    private readonly publicBoothService: PublicBoothService,
    private readonly utilService: UtilService,
  ) {}

  async findBoothBelongsToAccount(boothId: number, accountId: number): Promise<Booth> {
    const booth = await findOneByPk(Booth, boothId);

    if(!booth) throw new EntityNotFoundException();
    else if(booth.ownerId !== accountId) throw new NoAccessException();
    else return booth;
  }

  async findOne(id: number, callerAccountId: number): Promise<Booth> {
    return await this.findBoothBelongsToAccount(id, callerAccountId);
  }

  async create(createBoothDto: CreateBoothDTO, ownerId: number): Promise<Booth> {
    return await create(Booth, createBoothDto, undefined, { ownerId });
  }

  async findAllGoodsOrderOfBooth(boothId: number, callerAccountId: number): Promise<Array<GoodsOrder>> {
    // Throws error if the booth not found or not belongs to the account
    await this.findBoothBelongsToAccount(boothId, callerAccountId);

    return await this.goodsOrderService.findAll(boothId);
  }

  async uploadBannerImage(boothId: number, file: MultipartFile, callerAccountId: number): Promise<IValueResponse> {
    return await this.utilService.processImageUpload(
      await this.findBoothBelongsToAccount(boothId, callerAccountId),
      "bannerImageId",
      file,
      "booth/banner",
      ImageSizeConstraintKey.BOOTH_BANNER,
      callerAccountId,
    );
  }

  async uploadInfoImage(boothId: number, file: MultipartFile, callerAccountId: number): Promise<IValueResponse> {
    return await this.utilService.processImageUpload(
      await this.findBoothBelongsToAccount(boothId, callerAccountId),
      "infoImageId",
      file,
      "booth/info",
      ImageSizeConstraintKey.BOOTH_INFO,
      callerAccountId,
    );
  }

  async deleteBannerImage(boothId: number, callerAccountId: number): Promise<ISuccessResponse> {
    return await this.utilService.processImageDelete(
      await this.findBoothBelongsToAccount(boothId, callerAccountId),
      "bannerImageId",
    );
  }

  async deleteInfoImage(boothId: number, callerAccountId: number): Promise<ISuccessResponse> {
    return await this.utilService.processImageDelete(
      await this.findBoothBelongsToAccount(boothId, callerAccountId),
      "infoImageId",
    );
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

    // Delete banner image
    if(booth.bannerImageId) {
      // TODO: calling this.deleteBannerImage() will execute find query again, which already found above.
      await this.deleteBannerImage(id, callerAccountId);
    }

    // Delete info image
    if(booth.infoImageId) {
      // TODO: calling this.deleteInfoImage() will execute find query again, which already found above.
      await this.deleteInfoImage(id, callerAccountId);
    }

    return await removeTarget(booth);
  }
}
