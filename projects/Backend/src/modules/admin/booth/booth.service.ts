import { randomUUID } from "crypto";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { IBoothMemberManipulationResponse, ISuccessResponse, IUploadStorage, IValueResponse, SUCCESS_RESPONSE } from "@myboothmanager/common";
import { MultipartFile } from "@fastify/multipart";
import Booth from "@/db/models/booth";
import GoodsOrder from "@/db/models/goods-order";
import { create, findOneByPk, generateUploadFileName, removeTarget } from "@/lib/common-functions";
import { EntityNotFoundException, NoAccessException } from "@/lib/exceptions";
import { PublicBoothService } from "@/modules/public/booth/booth.service";
import UploadStorage from "@/db/models/uploadstorage";
import { GoodsOrderService } from "../goods-order/goods-order.service";
import { UtilService } from "../util/util.service";
import { UpdateBoothDTO } from "./dto/update-booth.dto";
import { CreateBoothDTO } from "./dto/create-booth.dto";
import { UpdateBoothStatusDTO } from "./dto/update-booth-status.dto";
import { BoothInfoUpdateFailedException, BoothMemberManipulationFailedException, BoothStatusUpdateFailedException } from "./booth.exception";
import { AddBoothMemberDTO } from "./dto/add-booth-member.dto";

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
    const uploadSubpath = "booth/banner";

    // TODO: file validation

    let fileName: string;
    try {
      fileName = generateUploadFileName("boothbanner", callerAccountId, boothId, "test", file.filename.split(".").pop()!).fileName;
      await this.utilService.writeFileTo(file, fileName, uploadSubpath);
    } catch(err) {
      console.error(err);
      throw new InternalServerErrorException();  // TODO: custom exception
    }

    try {
      const booth = await this.findBoothBelongsToAccount(boothId, callerAccountId);

      if(booth.bannerImageId) {
        const existingUpload = await UploadStorage.findByPk(booth.bannerImageId);
        if(existingUpload) {
          this.utilService.removeFile(existingUpload.fileName, existingUpload.savePath);
          await existingUpload.destroy({ force: true });
        }
      }

      const upload = await create(UploadStorage, {
        ownerId: callerAccountId,
        savePath: uploadSubpath,
        fileName,
      } as Omit<IUploadStorage, "id">);
      await upload.save();

      await booth.update({ bannerImageId: upload.id });

      return {
        value: upload.filePath,
      };
    } catch(err) {
      console.error(err);
      throw new InternalServerErrorException();  // TODO: custom exception
    }
  }

  async uploadInfoImage(boothId: number, file: MultipartFile, callerAccountId: number): Promise<IValueResponse> {
    const uploadSubpath = "booth/info";

    let fileName: string;
    try {
      fileName = generateUploadFileName("boothinfo", callerAccountId, boothId, "test", file.filename.split(".").pop()!).fileName;
      await this.utilService.writeFileTo(file, fileName, uploadSubpath);
    } catch(err) {
      console.error(err);
      throw new InternalServerErrorException();  // TODO: custom exception
    }

    try {
      const booth = await this.findBoothBelongsToAccount(boothId, callerAccountId);

      if(booth.infoImageId) {
        const existingUpload = await UploadStorage.findByPk(booth.infoImageId);
        if(existingUpload) {
          this.utilService.removeFile(existingUpload.fileName, existingUpload.savePath);
          await existingUpload.destroy({ force: true });
        }
      }

      const upload = await create(UploadStorage, {
        ownerId: callerAccountId,
        savePath: uploadSubpath,
        fileName,
      } as Omit<IUploadStorage, "id">);
      await upload.save();

      await booth.update({ infoImageId: upload.id });

      return {
        value: upload.filePath,
      };
    } catch(err) {
      console.error(err);
      throw new InternalServerErrorException();  // TODO: custom exception
    }
  }

  async deleteBannerImage(boothId: number, callerAccountId: number): Promise<ISuccessResponse> {
    try {
      const booth = await this.findBoothBelongsToAccount(boothId, callerAccountId);

      if(booth.bannerImageId) {
        const existingUpload = await UploadStorage.findByPk(booth.bannerImageId);
        if(existingUpload) {
          this.utilService.removeFile(existingUpload.fileName, existingUpload.savePath);
          await existingUpload.destroy({ force: true });
        }
      }

      booth.set("bannerImageId", null);
      await booth.save();

      return SUCCESS_RESPONSE;
    } catch(err) {
      console.error(err);
      throw new InternalServerErrorException();  // TODO: custom exception
    }
  }

  async deleteInfoImage(boothId: number, callerAccountId: number): Promise<ISuccessResponse> {
    try {
      const booth = await this.findBoothBelongsToAccount(boothId, callerAccountId);

      if(booth.infoImageId) {
        const existingUpload = await UploadStorage.findByPk(booth.infoImageId);
        if(existingUpload) {
          this.utilService.removeFile(existingUpload.fileName, existingUpload.savePath);
          await existingUpload.destroy({ force: true });
        }
      }

      booth.set("infoImageId", null);
      await booth.save();

      return SUCCESS_RESPONSE;
    } catch(err) {
      console.error(err);
      throw new InternalServerErrorException();  // TODO: custom exception
    }
  }

  async addMember(addBoothMemberDto: AddBoothMemberDTO, callerAccountId: number): Promise<IBoothMemberManipulationResponse> {
    const booth = await this.findBoothBelongsToAccount(addBoothMemberDto.boothId, callerAccountId);

    try {
      if(!booth.members) booth.members = [];

      booth.members.push({
        uuid: randomUUID(),
        name: addBoothMemberDto.name,
        descriptionShort: addBoothMemberDto.descriptionShort,
        role: addBoothMemberDto.role,
        primaryColor: addBoothMemberDto.primaryColor,
        url: addBoothMemberDto.url,
      });
      booth.changed("members", true);

      return {
        boothId: booth.id,
        members: (await booth.save({ fields: ["members"] })).members,
      };
    } catch(err) {
      throw new BoothMemberManipulationFailedException();
    }
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
