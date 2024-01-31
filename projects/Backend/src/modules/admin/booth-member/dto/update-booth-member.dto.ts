import { PartialType } from "@nestjs/mapped-types";
import { IBoothMemberUpdateRequest } from "@myboothmanager/common";
import { CreateBoothMemberDTO } from "./create-booth-member.dto";

export class UpdateBoothMemberDTO extends PartialType(CreateBoothMemberDTO) implements IBoothMemberUpdateRequest { }
