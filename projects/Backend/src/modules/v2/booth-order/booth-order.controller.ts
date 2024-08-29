import { Controller } from "@nestjs/common";
import { BoothOrderService } from "./booth-order.service";

@Controller("/booth/order")
export class BoothOrderController {
  constructor(
    private readonly order: BoothOrderService,
  ) { }
}
