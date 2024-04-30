import type { IDataModelBase } from "./base";

export interface IBoothMember extends IDataModelBase {
  id: number;
  boothId: number;  // Foreign key to Booth.id
  name: string;
  descriptionShort?: string | null;
  role?: string | null;
  primaryColor?: string | null;
  url?: string | null;
  memberImageUrl?: string | null;
  memberImageThumbnailData?: string | null;
}
export type IBoothMemberResponse = IBoothMember;

export interface IBoothMemberModel extends Omit<IBoothMember, "memberImageUrl" | "memberImageThumbnailData"> {
  memberImageId?: number | null;
}

export type BoothMemberCreateRequestKey = "name" | "descriptionShort" | "role" | "primaryColor" | "url";
export type IBoothMemberCreateRequest = Pick<IBoothMember, BoothMemberCreateRequestKey>;

export type BoothMemberUpdateRequestKey = "name" | "descriptionShort" | "role" | "primaryColor" | "url";
export type IBoothMemberUpdateRequest = Partial<Pick<IBoothMember, BoothMemberUpdateRequestKey>>;
