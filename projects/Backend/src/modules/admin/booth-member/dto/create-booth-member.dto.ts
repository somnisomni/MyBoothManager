import type { IBoothMemberCreateRequest } from "@myboothmanager/common";

export class CreateBoothMemberDTO implements IBoothMemberCreateRequest {
  name!: string;
  descriptionShort?: string;
  role?: string;
  url?: string;
  primaryColor?: string;
}
