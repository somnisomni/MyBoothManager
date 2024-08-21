import { Controller } from "@nestjs/common";
import { BoothService } from "./booth.service";

@Controller("/booth")
export class BoothController {
  constructor(private readonly boothService: BoothService) { }
}
