import type { IImageUploadInfo } from "./base";

/* === Common === */
interface IBoothMemberCommon {
  id: number;
  boothId: number;
  name: string;
  descriptionShort?: string | null;
  role?: string | null;
  url?: string | null;
  primaryColor?: string | null;
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
export type IBoothMemberCreateRequest = Omit<IBoothMemberCommon, "id">;
export type IBoothMemberUpdateRequest = Partial<Omit<IBoothMemberCommon, "id" | "boothId">> & Pick<IBoothMemberCommon, "boothId">;

/* === Responses === */
export type IBoothMemberResponse = IBoothMember;
