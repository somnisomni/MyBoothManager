import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { UtilService } from "../admin/util/util.service";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: UtilService.RESOLVED_UPLOAD_PATH,
    }),
  ],
  providers: [],
  exports: [],
})
export class UploadModule { }
