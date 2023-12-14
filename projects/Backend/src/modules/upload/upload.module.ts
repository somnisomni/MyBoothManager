import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { UtilService } from "../admin/util/util.service";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: UtilService.RESOLVED_UPLOAD_PATH,
      serveRoot: "/uploads",
      serveStaticOptions: {
        etag: true,
        index: false,
        cacheControl: true,
      },
    }),
  ],
})
export class UploadModule { }
