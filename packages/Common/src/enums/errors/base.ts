export enum ErrorCodes {
  SUCCESS = -1,
  UNKNOWN_ERROR = 0,

  // XXX: Generic errors
  INTERNAL_ERROR        = 1,
  ROUTE_NOT_FOUND       = 2,
  ENTITY_NOT_FOUND      = 3,
  INVALID_REQUEST_BODY  = 4,
  INVALID_REQUEST_QUERY = 5,
  INVALID_HTTP_METHOD   = 6,
  NO_ACCESS             = 7,
  ENTITY_DUPLICATED     = 8,

  // 1XXX: Authentication/Account errors
  UNKNOWN_AUTH_ERROR      = 1000,
  INVALID_AUTH_TOKEN      = 1001,
  EXPIRED_AUTH_TOKEN      = 1002,
  INVALID_REFRESH_TOKEN   = 1003,
  EXPIRED_REFRESH_TOKEN   = 1004,
  AUTH_REFRESH_FAILED     = 1005,
  ACCOUNT_BANNED          = 1006,
  ACCOUNT_DISABLED        = 1007,
  AUTH_TOKEN_NEED_REFRESH = 1008,
  AUTH_TOKEN_MISSING      = 1009,
  NEED_RELOGIN            = 1010,
  SESSION_ALREADY_EXISTS  = 1011,

  // 2XXX: Booth errors
  UNKNOWN_BOOTH_ERROR              = 2000,
  BOOTH_STATUS_UPDATE_FAILED       = 2001,
  BOOTH_INFO_UPDATE_FAILED         = 2002,
  BOOTH_MEMBER_MANIPULATION_FAILED = 2003,

  // 3XXX: Goods errors
  UNKNOWN_GOODS_ERROR          = 3000,
  GOODS_PARENT_BOOTH_NOT_FOUND = 3001,
  GOODS_STATUS_UPDATE_FAILED   = 3002,
  GOODS_INFO_UPDATE_FAILED     = 3003,

  // 4XXX: Goods category errors
  UNKNOWN_GOODS_CATEGORY_ERROR          = 4000,
  GOODS_CATEGORY_PARENT_BOOTH_NOT_FOUND = 4001,
  GOODS_CATEGORY_INFO_UPDATE_FAILED     = 4002,

  // 5XXX: Goods order errors
  UNKNOWN_GOODS_ORDER_ERROR                               = 5000,
  GOODS_ORDER_PARENT_BOOTH_NOT_FOUND                      = 5001,
  GOODS_ORDER_INVALID_CREATE_REQUEST_ORDER_EMPTY          = 5002,
  GOODS_ORDER_INVALID_CREATE_REQUEST_GOODS_NOT_FOUND      = 5003,
  GOODS_ORDER_INVALID_CREATE_REQUEST_INVALID_GOODS_AMOUNT = 5004,
  GOODS_ORDER_STATUS_UPDATE_FAILED                        = 5005,
  GOODS_ORDER_STATUS_UPDATE_PROHIBITED                    = 5006,
}
