import { PartialType } from "@nestjs/mapped-types";
import { CreateBoothDTO } from "./create-booth.dto";

export class UpdateBoothDTO extends PartialType(CreateBoothDTO) {}
