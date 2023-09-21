import { BoothStatus } from "@myboothmanager/common";

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
