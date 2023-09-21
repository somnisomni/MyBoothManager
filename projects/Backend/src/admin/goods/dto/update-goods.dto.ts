import { PartialType } from "@nestjs/mapped-types";
import { IGoodsUpdateRequest } from "@myboothmanager/common";
import { CreateGoodsDTO } from "./create-goods.dto";

export class UpdateGoodsDTO extends PartialType(CreateGoodsDTO) implements IGoodsUpdateRequest { }
