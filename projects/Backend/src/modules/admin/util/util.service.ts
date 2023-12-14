import path from "path";
import { createWriteStream } from "fs";
import * as fs from "fs/promises";
import { MultipartFile } from "@fastify/multipart";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { type FastifyRequest } from "fastify";
import { path as APP_ROOT_PATH } from "app-root-path";
import { MAX_UPLOAD_FILE_BYTES } from "@myboothmanager/common";
import { InvalidRequestBodyException, RequestMaxSizeExceededException } from "@/lib/exceptions";

@Injectable()
export class UtilService {
  constructor() { }

  // NOTE: App root path resolves monorepo root, not the project root
  /**
   * Use `UtilService.safeResolveUploadFolder()` or `UtilService.getFileUploadPath()` instead for normal usage
   */
  public static RESOLVED_UPLOAD_PATH: string = path.resolve(APP_ROOT_PATH, process.env.FILE_UPLOAD_FOLDER || "uploads");

  private validateFileSize(file: MultipartFile, maxSize: number = MAX_UPLOAD_FILE_BYTES): boolean {
    if(file.file.readableLength > maxSize) throw new RequestMaxSizeExceededException();

    return true;
  }

  async safeResolveUploadFolder(subpath?: string): Promise<string> {
    const resolvedPath = path.resolve(UtilService.RESOLVED_UPLOAD_PATH, subpath || "");

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

  async getFileUploadPath(fileName: string, subpath?: string) {
    return path.resolve(await this.safeResolveUploadFolder(subpath), fileName);
  }

  async getFileFromRequest(req: FastifyRequest, validate: boolean = true) {
    let file: MultipartFile | undefined | null = null;

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

  async writeFileTo(file: MultipartFile, fileName: string, subpath?: string): Promise<string> {
    const filePath = await this.getFileUploadPath(fileName, subpath);
    return new Promise<string>((resolve, reject) => {
      try {
        file.file.pipe(createWriteStream(filePath, { flags: "w", autoClose: true }));
        resolve(filePath);
      } catch(err) {
        reject(err);
        throw new InternalServerErrorException();
      }
    });
  }

  async removeFile(fileName: string, subpath?: string): Promise<boolean> {
    const filePath = await this.getFileUploadPath(fileName, subpath);

    try {
      await fs.rm(filePath);
      return true;
    } catch(err) {
      console.error(err);
      return false;
    }
  }
}
