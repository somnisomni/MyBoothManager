import { Injectable } from "@nestjs/common";
import { ISuccessResponse, SUCCESS_RESPONSE } from "@myboothmanager/common";
import Fair from "@/db/models/fair";
import { CreateFairRequestDto } from "./dto/create.dto";
import { FairInfoUpdateFailedException, FairPassedException } from "./fair.exception";
import { UpdateFairRequestDto } from "./dto/update.dto";
import { findOneByPk, findAll as dbFindAll, create as dbCreate, removeByPk } from "@/lib/utils/db";

@Injectable()
export class FairService {
  constructor() { }

  /**
   * Finds all fairs.
   * @param includePassed Whether to include passed fairs in the result. default: `false`
   * @returns Array of found `Fair` entities
   */
  async findAll(includePassed = false): Promise<Fair[]> {
    const fairs = await dbFindAll(Fair, { });

    return fairs.filter(fair => includePassed || (!includePassed && !fair.isPassed));
  }

  /**
   * Finds a fair by ID.
   * @param id ID of the fair
   * @param allowPassed Whether to allow returning passed fairs. default: `false`
   * @returns Found `Fair` entity
   * @throws `FairPassedException` if the fair is passed while `allowPassed` is `false`
   */
  async findOne(id: number, allowPassed = false): Promise<Fair> {
    const fair = await findOneByPk(Fair, id);

    if(!allowPassed && fair.isPassed) {
      throw new FairPassedException();
    }

    return fair;
  }

  /**
   * Creates a new fair.
   * @param dto DTO for creating a new fair
   */
  async create(dto: CreateFairRequestDto): Promise<Fair> {
    return await dbCreate(Fair, dto);
  }

  /**
   * Updates information of a fair.
   * @param id ID of the fair
   * @param dto DTO for updating fair information
   * @returns Updated `Fair` entity
   * @throws `FairInfoUpdateFailedException` if the update failed
   */
  async update(id: number, dto: UpdateFairRequestDto): Promise<Fair> {
    try {
      return await (await (await this.findOne(id, true)).update({
        ...dto,
        openingDates: dto.openingDates?.map(date => String(date)),
      })).save();
    } catch(error) {
      throw new FairInfoUpdateFailedException();
    }
  }

  /**
   * Removes a fair. This should be AVOIDED as much as possible, as it may cause many unexpected behaviours related to booths.
   * @param id ID of the fair
   * @returns `SUCCESS_RESPONSE`
   */
  async remove(id: number): Promise<ISuccessResponse> {
    // TODO: Unassociate booths with the fair

    return await removeByPk(Fair, id) ? SUCCESS_RESPONSE : SUCCESS_RESPONSE;
  }
}
