import { MultipartFile } from "@fastify/multipart";
import { Injectable } from "@nestjs/common";
import { type FastifyRequest } from "fastify";
import { InvalidRequestBodyException } from "@/lib/exceptions";

@Injectable()
export class UtilService {
  constructor() { }

  async getFileFromRequest(req: FastifyRequest) {
    try {
      return await req.file();
    } catch(error) {
      throw new InvalidRequestBodyException();
    }
  }

  async getFilesFromRequest(req: FastifyRequest) {
    const files: Array<MultipartFile> = [];

    try {
      for await (const file of req.files()) {
        files.push(file);
      }
    } catch(error) {
      throw new InvalidRequestBodyException();
    }

    return files;
  }
}
