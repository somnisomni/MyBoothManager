import { IBoothMemberModel, IBoothMemberResponse } from "@myboothmanager/common";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class BoothMemberResponseDto implements IBoothMemberResponse {
  @Expose() declare id: number;
  @Expose() declare boothId: number;
  @Expose() declare name: string;
  @Expose() declare descriptionShort?: string;
  @Expose() declare role?: string;
  @Expose() declare primaryColor?: string;
  @Expose() declare url?: string;
  @Expose() declare memberImageUrl?: string;

  constructor(partial: Partial<IBoothMemberModel>) {
    Object.assign(this, partial);
  }
}
