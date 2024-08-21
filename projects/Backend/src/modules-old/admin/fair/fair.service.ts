import { Injectable } from "@nestjs/common";
import { ISuccessResponse } from "@myboothmanager/common";
import Fair from "@/db/models/fair";
import { create, removeOne } from "@/lib/common-functions";
import { CreateFairRequestDto } from "./dto/create-fair.dto";

@Injectable()
export class FairService {
  async create(dto: CreateFairRequestDto): Promise<Fair> {
    return await create(Fair, dto);
  }

  async remove(id: number): Promise<ISuccessResponse> {
    return await removeOne(Fair, { id });
  }
}
