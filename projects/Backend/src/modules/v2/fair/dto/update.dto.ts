import type { IFairUpdateRequest } from "@myboothmanager/common";
import { PartialType } from "@nestjs/mapped-types";
import { CreateFairRequestDto } from "./create.dto";

export class UpdateFairRequestDto extends PartialType(CreateFairRequestDto) implements IFairUpdateRequest { }
