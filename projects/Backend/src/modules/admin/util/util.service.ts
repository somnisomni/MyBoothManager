import path from "path";
import * as fs from "fs/promises";
import { MultipartFile } from "@fastify/multipart";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
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

  private async getFileUploadFolder(folderName: string | undefined = process.env.FILE_UPLOAD_FOLDER): Promise<string> {
    if(!folderName || folderName.length <= 0) folderName = "uploads";

    // FIXME: __dirname resolves to this folder (the folder containing this util.service.ts/js), not the project root
    const resolvedPath = path.resolve(__dirname, folderName);

    // Create folder, ignore if already exists
    await fs.mkdir(resolvedPath, { recursive: true });

    try {
      // Test if the folder is accessable
      await fs.access(resolvedPath, fs.constants.R_OK | fs.constants.W_OK);
    } catch(err) {
      console.error(err);
      throw new InternalServerErrorException("Can't access to uploads");
    }

    return resolvedPath;
  }

  async getFileUploadPath(fileName: string) {
    return path.resolve(await this.getFileUploadFolder(), fileName);
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
