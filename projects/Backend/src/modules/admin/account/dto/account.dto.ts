import { IAccountResponse } from "@myboothmanager/common";
import { Exclude, Expose } from "class-transformer";
import Account from "@/db/models/account";

@Exclude()
export class AccountResponseDto implements IAccountResponse {
  @Expose() declare id: number;
  @Expose() declare loginId: string;
  @Expose() declare name: string;
  @Expose() declare lastSelectedBoothId?: number | null;
  @Expose() declare superAdmin?: boolean;

  constructor(model: Account, isSuperAdmin?: boolean) {
    const values = model.get();

    this.id = values.id;
    this.loginId = values.loginId;
    this.name = values.name;
    this.lastSelectedBoothId = values.lastSelectedBoothId;
    this.superAdmin = isSuperAdmin;
  }
}
