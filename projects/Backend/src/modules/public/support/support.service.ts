import { Injectable } from "@nestjs/common";
import { APP_NAME, ISuccessResponse, SUCCESS_RESPONSE } from "@myboothmanager/common";
import { FeedbackRequestDto } from "./dto/feedback.dto";
import { ApplicationUncaughtedException } from "@/lib/exceptions";

@Injectable()
export class SupportService {
  constructor() { }

  async relayFeedbackToDiscordWebhook(dto: FeedbackRequestDto): Promise<ISuccessResponse> {
    // Check Discord webhook URL envvar
    if(!process.env.SUPERADMIN_DISCORD_WEBHOOK_URL) {
      console.warn("Got feedback but the environment variable `SUPERADMIN_DISCORD_WEBHOOK_URL` is not set. Write the feedback DTO to stdout instead.");
      console.info(dto);
      return SUCCESS_RESPONSE;
    }

    // Construct Discord webhook URL
    const webhookUrl = new URL(process.env.SUPERADMIN_DISCORD_WEBHOOK_URL);
    webhookUrl.searchParams.append("wait", "true");

    // Relay feedback content to Discord webhook
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: `${APP_NAME} Feedback`,
        embeds: [
          {
            description: dto.content,
            timestamp: new Date().toISOString(),
            author: {
              name: `${dto.senderName} (#${dto.senderId})`,
            },
            provider: {
              name: APP_NAME,
              url: process.env.FRONTEND_PUBLIC_URL,
            },
            footer: {
              text: `Sender user type: ${dto.senderType}\nFeedback type: ${dto.type}`,
            },
          },
        ],
      }),
    });

    // Check Discord webhook API response
    if(response.ok && (response.status === 200 || response.status === 204)) {
      return SUCCESS_RESPONSE;
    } else {
      throw new ApplicationUncaughtedException();
    }
  }
}
