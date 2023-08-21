import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateBoothDTO } from "./dto/create-booth.dto";
import { UpdateBoothDTO } from "./dto/update-booth.dto";
import { Booth } from "./entities/booth.entity";
import { boothList } from "@/dev/temp-data";

@Injectable()
export class BoothService {
  create(createBoothDto: CreateBoothDTO) {
    throw new BadRequestException("Booth creation is not yet supported.");
  }

  findAll(): Array<Booth> {
    return Object.values(boothList);
  }

  findOne(id: number): Booth {
    if(!boothList[id]) throw new BadRequestException("Booth not found.");

    return boothList[id];
  }

  update(id: number, updateBoothDto: UpdateBoothDTO) {
    throw new BadRequestException("Booth update is not yet supported.");
  }

  remove(id: number) {
    throw new BadRequestException("Booth deletion is not yet supported.");
  }
}
