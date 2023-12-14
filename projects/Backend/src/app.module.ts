import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AdminModule } from "./modules/admin/admin.module";
import { PublicModule } from "./modules/public/public.module";
import { UploadModule } from "./modules/upload/upload.module";

@Module({
  imports: [
    AdminModule,
    PublicModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
