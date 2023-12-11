import { MultipartFile } from "@fastify/multipart";
import { Injectable } from "@nestjs/common";
import { type FastifyRequest } from "fastify";
import { MAX_UPLOAD_FILE_BYTES } from "@myboothmanager/common";
import { InvalidRequestBodyException, RequestMaxSizeExceededException } from "@/lib/exceptions";

@Injectable()
export class UtilService {
  constructor() { }

  private validateFileSize(file: MultipartFile, maxSize: number = MAX_UPLOAD_FILE_BYTES): boolean {
    if(file.file.readableLength > maxSize) throw new RequestMaxSizeExceededException();

    return true;
  }

  async getFileFromRequest(req: FastifyRequest, validate: boolean = true) {
    let file: MultipartFile | null = null;

    try {
      file = await req.file();
    } catch(error) {
      throw new InvalidRequestBodyException();
    }

    if(!file) throw new InvalidRequestBodyException();

    if(validate) {
      const validations = [
        this.validateFileSize(file),
      ];

      if(validations.some((validation) => !validation)) throw new InvalidRequestBodyException();
    }

    return file;
  }

  async getFilesFromRequest(req: FastifyRequest, validate: boolean = true) {
    const files: Array<MultipartFile> = [];

    try {
      for await (const file of req.files()) {
        files.push(file);
      }
    } catch(error) {
      throw new InvalidRequestBodyException();
    }

    if(files.length <= 0) throw new InvalidRequestBodyException();

    if(validate) {
      for(const file of files) {
        const validations = [
          this.validateFileSize(file),
        ];

        if(validations.some((validation) => !validation)) throw new InvalidRequestBodyException();
      }
    }

    return files;
  }
}
