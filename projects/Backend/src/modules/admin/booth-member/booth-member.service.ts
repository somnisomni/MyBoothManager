import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ISuccessResponse, IUploadStorage, IValueResponse, SUCCESS_RESPONSE } from "@myboothmanager/common";
import { MultipartFile } from "@fastify/multipart";
import { create, generateUploadFileName, removeTarget } from "@/lib/common-functions";
import Booth from "@/db/models/booth";
import { NoAccessException } from "@/lib/exceptions";
import BoothMember from "@/db/models/booth-member";
import { PublicBoothMemberService } from "@/modules/public/booth-member/booth-member.service";
import UploadStorage from "@/db/models/uploadstorage";
import { UtilService } from "../util/util.service";
import { UpdateBoothMemberDTO } from "./dto/update-booth-member.dto";
import { CreateBoothMemberDTO } from "./dto/create-booth-member.dto";
import { BoothMemberInfoUpdateFailedException, BoothMemberParentBoothNotFoundException } from "./booth-member.exception";

@Injectable()
export class BoothMemberService {
  constructor(
    private readonly publicBoothMemberService: PublicBoothMemberService,
    private readonly utilService: UtilService,
  ) { }

  async getBoothMemberAndParentBooth(memberId: number, boothId: number, callerAccountId: number): Promise<{ booth: Booth, member: BoothMember }> {
    const member = await this.publicBoothMemberService.findOne(boothId, memberId);

    if(member.boothId !== boothId) throw new NoAccessException();

    const booth = await Booth.findOne({ where: { id: boothId, ownerId: callerAccountId } });
    if(!booth) throw new BoothMemberParentBoothNotFoundException();
    if(booth.ownerId !== callerAccountId) throw new NoAccessException();

    return { booth, member };
  }

  async findBoothMemberBelongsToBooth(memberId: number, boothId: number, callerAccountId: number): Promise<BoothMember> {
    const { member } = await this.getBoothMemberAndParentBooth(memberId, boothId, callerAccountId);
    return member;
  }

  async create(boothId: number, createBoothMemberDTO: CreateBoothMemberDTO, callerAccountId: number): Promise<BoothMember> {
    if(!(await Booth.findOne({ where: { id: boothId, ownerId: callerAccountId } }))) {
      throw new BoothMemberParentBoothNotFoundException();
    }

    return await create(BoothMember, {
      ...createBoothMemberDTO,
      boothId,
    });
  }

  async update(boothId: number, id: number, updateBoothMemberDTO: UpdateBoothMemberDTO, callerAccountId: number): Promise<BoothMember> {
    const member = await this.findBoothMemberBelongsToBooth(id, boothId, callerAccountId);

    try {
      return (await member.update({
        ...updateBoothMemberDTO,
        boothId: undefined,
      })).save();
    } catch(err) {
      throw new BoothMemberInfoUpdateFailedException();
    }
  }

  async uploadMemberImage(boothId: number, id: number, file: MultipartFile, callerAccountId: number): Promise<IValueResponse> {
    const member = await this.findBoothMemberBelongsToBooth(id, boothId, callerAccountId);
    const uploadSubpath = "booth/member";

    let fileName: string;
    try {
      fileName = generateUploadFileName("boothmember", callerAccountId, id, "test", file.filename.split(".").pop()!).fileName;
      await this.utilService.writeFileTo(file, fileName, uploadSubpath);
    } catch(err) {
      console.error(err);
      throw new InternalServerErrorException();  // TODO: custom exception
    }

    try {
      if(member.memberImageId) {
        const existingUpload = await UploadStorage.findByPk(member.memberImageId);
        if(existingUpload) {
          this.utilService.removeFile(existingUpload.fileName, existingUpload.savePath);
          await existingUpload.destroy({ force: true });
        }
      }

      const upload = await (await create(UploadStorage, {
        ownerId: callerAccountId,
        savePath: uploadSubpath,
        fileName,
      } as Omit<IUploadStorage, "id">)).save();

      await member.update({ memberImageId: upload.id });

      return {
        value: upload.filePath,
      };
    } catch(err) {
      console.error(err);
      throw new InternalServerErrorException();  // TODO: custom exception
    }
  }

  async deleteMemberImage(boothId: number, id: number, callerAccountId: number): Promise<ISuccessResponse> {
    const member = await this.findBoothMemberBelongsToBooth(id, boothId, callerAccountId);

    try {
      if(member.memberImageId) {
        const existingUpload = await UploadStorage.findByPk(member.memberImageId);
        if(existingUpload) {
          this.utilService.removeFile(existingUpload.fileName, existingUpload.savePath);
          await existingUpload.destroy({ force: true });
        }
      }

      member.set("memberImageId", null);
      await member.save();

      return SUCCESS_RESPONSE;
    } catch(err) {
      console.error(err);
      throw new InternalServerErrorException();  // TODO: custom exception
    }
  }

  async remove(boothId: number, id: number, callerAccountId: number): Promise<ISuccessResponse> {
    const member = await this.findBoothMemberBelongsToBooth(id, boothId, callerAccountId);

    // TODO: first, remove the member from assigned goods to the member

    return await removeTarget(member, undefined, true);
  }
}
