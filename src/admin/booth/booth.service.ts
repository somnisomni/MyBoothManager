import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateBoothDTO } from "./dto/create-booth.dto";
import { UpdateBoothDTO } from "./dto/update-booth.dto";
import Booth, { IBooth } from "@/db/models/booth";
import { OmitInternals } from "@/lib/interface-omit";

type BoothOutput = OmitInternals<IBooth>;

@Injectable()
export class BoothService {
  create(createBoothDto: CreateBoothDTO) {
    throw new BadRequestException("Booth creation is not yet supported.");
  }

  async findAll(): Promise<Array<BoothOutput>> {
    return (await Booth.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt"],
      },
    })) as Array<BoothOutput>;
  }

  async findOne(id: number): Promise<BoothOutput> {
    const booth = await Booth.findByPk(id, {
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt"],
      },
    }) as BoothOutput;

    if(!booth) throw new BadRequestException("Booth not found.");
    return booth;
  }

  update(id: number, updateBoothDto: UpdateBoothDTO) {
    throw new BadRequestException("Booth update is not yet supported.");
  }

  remove(id: number) {
    throw new BadRequestException("Booth deletion is not yet supported.");
  }
}
