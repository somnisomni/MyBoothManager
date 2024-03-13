import { BoothStatus, GoodsOrderPaymentMethod, GoodsOrderStatus, GoodsStatus } from "@myboothmanager/common";

export function getBoothStatusString(status: BoothStatus): string {
  return {
    [BoothStatus.CLOSE]: "운영 종료",
    [BoothStatus.OPEN]: "운영 중",
    [BoothStatus.PAUSE]: "운영 일시 중지",
    [BoothStatus.PREPARE]: "운영 준비 중",
  }[status];
}

export function getGoodsStatusString(status: GoodsStatus): string {
  return {
    [GoodsStatus.ON_SALE]: "판매 중",
    [GoodsStatus.SOLD_OUT]: "품절",
    [GoodsStatus.PAUSE]: "판매 일시 중지",
  }[status];
}

export function getGoodsOrderStatusString(status: GoodsOrderStatus): string {
  return {
    [GoodsOrderStatus.RECORDED]: "정상 기록됨",
    [GoodsOrderStatus.CANCELED]: "취소됨",
  }[status];
}

export function getPaymentMethodString(paymentMethod: GoodsOrderPaymentMethod): string {
  return {
    [GoodsOrderPaymentMethod.CARD]: "신용 · 체크 카드",
    [GoodsOrderPaymentMethod.CASH]: "현금",
    [GoodsOrderPaymentMethod.PREPAID]: "사전 지불 (선입금 등)",
    [GoodsOrderPaymentMethod.TRANSFER]: "계좌 · QR 입금",
  }[paymentMethod];
}

export function getPaymentMethodIcon(paymentMethod: GoodsOrderPaymentMethod): string {
  return {
    [GoodsOrderPaymentMethod.CARD]: "mdi-credit-card",
    [GoodsOrderPaymentMethod.CASH]: "mdi-cash-multiple",
    [GoodsOrderPaymentMethod.PREPAID]: "mdi-cash-fast",
    [GoodsOrderPaymentMethod.TRANSFER]: "mdi-account-cash",
  }[paymentMethod];
}
