import { IImageUploadInfo } from "./base";

/* === Common === */
interface IBoothMemberCommon {
  id: number;
  boothId: number;
  name: string;
  descriptionShort?: string | null;
  role?: string | null;
  primaryColor?: string | null;
  url?: string | null;
}

/* === Frontend === */
export interface IBoothMember extends IBoothMemberCommon {
  avatarImage?: IImageUploadInfo | null;
}

/* === Model for Backend (DB) === */
export interface IBoothMemberModel extends IBoothMemberCommon {
  avatarImageId?: number | null;
}

/* === Requests === */
export interface IBoothMemberCreateRequest extends Omit<IBoothMemberCommon, "id"> { }
export interface IBoothMemberUpdateRequest extends Partial<Omit<IBoothMemberCommon, "id" | "boothId">>, Pick<IBoothMemberCommon, "boothId">  { }

/* === Responses === */
export interface IBoothMemberResponse extends IBoothMember { }
