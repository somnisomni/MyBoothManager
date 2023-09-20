import { Injectable, InternalServerErrorException, NotFoundException, NotImplementedException } from "@nestjs/common";
import { CreateAccountDTO } from "./dto/create-account.dto";
import { UpdateAccountDTO } from "./dto/update-account.dto";
import Account from "@/db/models/account";
import { IStatusOKResponse, SEQUELIZE_INTERNAL_KEYS, STATUS_OK_RESPONSE } from "@myboothmanager/common";
import { IAuthPayload } from "../auth/jwt";

@Injectable()
export class AccountService {
  async create(createAccountDto: CreateAccountDTO): Promise<Account> {
    const result = await Account.create(createAccountDto);

    if(result) return result;
    else throw new InternalServerErrorException("계정을 생성할 수 없습니다.");
  }

  async findCurrent(authData: IAuthPayload): Promise<Account> {
    return await this.findOneById(authData.id);
  }

  async findAll(): Promise<Array<Account>> {
    const result = await Account.findAll({
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });

    if(result && result.length > 0) return result;
    else throw new NotFoundException("사용 가능한 계정이 존재하지 않습니다.");
  }

  async findOneById(id: number): Promise<Account> {
    const result = await Account.findOne({
      where: { id },
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });

    if(result) return result;
    else throw new NotFoundException("계정을 찾을 수 없습니다.");
  }

  async findOneByLoginId(loginId: string): Promise<Account> {
    const result = await Account.findOne({
      where: { loginId },
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });

    if(result) return result;
    else throw new NotFoundException("계정을 찾을 수 없습니다.");
  }

  update(id: number, updateAccountDto: UpdateAccountDTO) {
    throw new NotImplementedException("ACCOUNT DATA UPDATE NOT IMPLEMENTED");
  }

  async remove(id: number): Promise<IStatusOKResponse> {
    const rows = await Account.destroy({
      where: { id },
    });

    if(rows === 1) return STATUS_OK_RESPONSE;
    else throw new InternalServerErrorException("계정을 삭제할 수 없습니다.");
  };
}
