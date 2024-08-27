import { Module } from "@nestjs/common";
import { UtilService } from "./util.service";
import { CSVService } from "./csv.service";

@Module({
  providers: [UtilService, CSVService],
  exports: [UtilService, CSVService],
})
export class UtilModule { }
