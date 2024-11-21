import type { IBoothMemberCreateRequest } from "@myboothmanager/common";

export class CreateBoothMemberRequestDto implements IBoothMemberCreateRequest {
  declare boothId: number;
  declare name: string;
  declare descriptionShort?: string;
  declare role?: string;
  declare url?: string;
  declare primaryColor?: string;
}
