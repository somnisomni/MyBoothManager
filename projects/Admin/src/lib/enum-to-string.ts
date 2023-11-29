import { BoothStatus, GoodsOrderStatus, GoodsStatus } from "@myboothmanager/common";

export function getBoothStatusString(status: BoothStatus): string {
  switch(status) {
    case BoothStatus.CLOSE:
      return "운영 종료";
    case BoothStatus.OPEN:
      return "운영 중";
    case BoothStatus.PAUSE:
      return "운영 일시 중지";
    case BoothStatus.PREPARE:
      return "운영 준비 중";
    default:
      return "알 수 없음";
  }
}

export function getGoodsStatusString(status: GoodsStatus): string {
  switch(status) {
    case GoodsStatus.ON_SALE:
      return "판매 중";
    case GoodsStatus.SOLD_OUT:
      return "품절";
    case GoodsStatus.PAUSE:
      return "판매 일시 중지";
    default:
      return "알 수 없음";
  }
}

export function getGoodsOrderStatusString(status: GoodsOrderStatus): string {
  switch(status) {
    case GoodsOrderStatus.RECORDED:
      return "정상 기록됨";
    case GoodsOrderStatus.CANCELED:
      return "취소됨";
    default:
      return "알 수 없음";
  }
}
