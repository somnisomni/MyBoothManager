import type { IAccountResponse, ISuperAdminAccountResponse } from "@myboothmanager/common";
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
    this.superAdmin = !isSuperAdmin ? undefined : isSuperAdmin;
  }
}

@Exclude()
export class SuperAdminAccountResponseDto extends AccountResponseDto implements ISuperAdminAccountResponse {
  @Expose() declare lastLoginAt?: Date | null;
  @Expose() declare loginCount: number;
  @Expose() declare createdAt?: Date | null;
  @Expose() declare updatedAt?: Date | null;

  constructor(model: Account) {
    super(model, false);

    this.loginCount = model.loginCount;
    this.lastLoginAt = model.lastLoginAt;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
  }
}
