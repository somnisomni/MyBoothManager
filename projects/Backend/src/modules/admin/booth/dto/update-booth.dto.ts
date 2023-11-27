import { PartialType } from "@nestjs/mapped-types";
import { IBoothUpdateReuqest } from "@myboothmanager/common";
import { CreateBoothDTO } from "./create-booth.dto";

export class UpdateBoothDTO extends PartialType(CreateBoothDTO) implements IBoothUpdateReuqest { }
