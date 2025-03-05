import type { IAccountAuthRefreshRequest } from "@myboothmanager/common";

export class RefreshRequestDto implements IAccountAuthRefreshRequest {
  declare id: number;
}
