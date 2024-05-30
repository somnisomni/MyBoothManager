import { Injectable } from "@nestjs/common";
import * as csv from "csv-parse";

@Injectable()
export class CSVService {
  constructor() { }

  async parseCSVString(csvStr: string, columns: Array<string> | true = true): Promise<Array<Record<string, unknown>>> {
    const normalized = csvStr.trim();

    const records = [];
    for await (const record of csv.parse(normalized, {
      columns,
      autoParse: true,
      bom: true,
      cast: true,
      delimiter: ",",
      trim: true,
      skipEmptyLines: true,
      skipRecordsWithEmptyValues: true,
      maxRecordSize: 128,
    }).iterator()) {
      records.push(record);
    }

    return records;
  }
}
