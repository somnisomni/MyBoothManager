import { IAccountNeedRefreshResponse } from "@myboothmanager/common";
import { UnauthorizedException } from "@nestjs/common";

export class UnauthorizedNeedRefreshException extends UnauthorizedException {
  constructor() {
    super("Need Refresh");
  }

  public override getResponse(): Record<string, unknown> & IAccountNeedRefreshResponse {
    return {
      ...super.getResponse() as object,
      needRefresh: true,
    };
  }
}
