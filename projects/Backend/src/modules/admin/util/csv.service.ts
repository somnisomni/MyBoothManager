import { Injectable } from "@nestjs/common";
import * as csv from "csv-parse";

@Injectable()
export class CSVService {
  constructor() { }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async parseCSVString<T extends Array<string>>(csvStr: string, columns: T | true = true): Promise<Array<Record<string, any>>> {
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
