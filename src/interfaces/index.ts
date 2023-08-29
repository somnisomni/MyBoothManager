import { IDataModelBase } from "./base";
import { AccountCreateRequestKey, IAccount, IAccountCreateRequest, IAccountResponse } from "./account";
import { IBooth, BoothStatus, BoothCreateRequestKey, IBoothCreateRequest, IBoothResponse } from "./booth";
import { IGoods, GoodsStatus, GoodsCreateRequestKey, IGoodsCreateRequest, IGoodsResponse } from "./goods";
import { GoodsCategoryCreateRequestKey, IGoodsCategory, IGoodsCategoryCreateRequest, IGoodsCategoryResponse } from "./goods-category";
import { GoodsSaleHistoryCreateRequestKey, IGoodsSaleHistory, IGoodsSaleHistoryCreateRequest, IGoodsSaleHistoryResponse } from "./goods-history";

export {
  /* base.ts */
  IDataModelBase,

  /* account.ts */
  IAccount,
  AccountCreateRequestKey,
  IAccountCreateRequest,
  IAccountResponse,

  /* booth.ts */
  IBooth,
  BoothStatus,
  BoothCreateRequestKey,
  IBoothCreateRequest,
  IBoothResponse,

  /* goods-category.ts */
  IGoodsCategory,
  GoodsCategoryCreateRequestKey,
  IGoodsCategoryCreateRequest,
  IGoodsCategoryResponse,

  /* goods-history.ts */
  IGoodsSaleHistory,
  GoodsSaleHistoryCreateRequestKey,
  IGoodsSaleHistoryCreateRequest,
  IGoodsSaleHistoryResponse,

  /* goods.ts */
  IGoods,
  GoodsStatus,
  GoodsCreateRequestKey,
  IGoodsCreateRequest,
  IGoodsResponse,
};
