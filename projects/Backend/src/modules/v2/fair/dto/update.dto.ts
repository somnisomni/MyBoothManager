import { PartialType } from "@nestjs/mapped-types";
import { IFairUpdateRequest } from "@myboothmanager/common";
import { CreateFairRequestDto } from "./create.dto";

export class UpdateFairRequestDto extends PartialType(CreateFairRequestDto) implements IFairUpdateRequest { }
