import { IBoothMemberResponse, IImageUploadInfo } from "@myboothmanager/common";
import { Exclude, Expose } from "class-transformer";
import BoothMember from "@/db/models/booth-member";

@Exclude()
export class BoothMemberResponseDto implements IBoothMemberResponse {
  @Expose() declare id: number;
  @Expose() declare name: string;
  @Expose() declare descriptionShort?: string | null;
  @Expose() declare role?: string | null;
  @Expose() declare primaryColor?: string | null;
  @Expose() declare url?: string | null;
  @Expose() declare avatarImage?: IImageUploadInfo | null;

  @Exclude() boothId = NaN;

  constructor(model: BoothMember) {
    const values = model.get();

    this.id = values.id;
    this.name = values.name;
    this.descriptionShort = values.descriptionShort;
    this.role = values.role;
    this.primaryColor = values.primaryColor;
    this.url = values.url;
    this.avatarImage = model.avatarImage?.toImageUploadInfo();
  }
}

export class AdminBoothMemberResponseDto extends BoothMemberResponseDto implements IBoothMemberResponse { }
