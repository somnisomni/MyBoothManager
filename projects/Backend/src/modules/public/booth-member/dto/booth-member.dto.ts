import { IBoothMemberModel, IBoothMemberResponse } from "@myboothmanager/common";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class BoothMemberResponseDto implements IBoothMemberResponse {
  @Expose() declare id: number;
  @Expose() declare name: string;
  @Expose() declare descriptionShort?: string | null;
  @Expose() declare role?: string | null;
  @Expose() declare primaryColor?: string | null;
  @Expose() declare url?: string | null;
  @Expose() declare memberImageUrl?: string | null;
  @Expose() declare memberImageThumbnailData?: string | null;

  @Exclude() declare boothId: number;

  constructor(partial: Partial<IBoothMemberModel>) {
    Object.assign(this, partial);
  }
}
