import { Body, Controller, Post } from "@nestjs/common";
import { SupportService } from "./support.service";
import { FeedbackRequestDto } from "./dto/feedback.dto";

@Controller("/public/support")
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post("/feedback")
  async relayFeedback(@Body() dto: FeedbackRequestDto) {
    return this.supportService.relayFeedbackToDiscordWebhook(dto);
  }
}
