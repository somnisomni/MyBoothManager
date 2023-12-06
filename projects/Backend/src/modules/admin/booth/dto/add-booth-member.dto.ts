import type { IBoothMemberAddRequest } from "@myboothmanager/common";

export class AddBoothMemberDTO implements IBoothMemberAddRequest {
  boothId!: number;
  name!: string;
  descriptionShort?: string;
  role!: string;
  primaryColor!: string;
  url?: string;
}
