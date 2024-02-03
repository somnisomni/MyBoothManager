import type { Model } from "sequelize-typescript";
import type { MultipartFile } from "@fastify/multipart";
import type { FastifyRequest } from "fastify";
import path from "path";
import { createWriteStream } from "fs";
import * as fs from "fs/promises";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { path as APP_ROOT_PATH } from "app-root-path";
import { ISuccessResponse, IUploadStorage, IValueResponse, ImageSizeConstraintKey, MAX_UPLOAD_FILE_BYTES, SUCCESS_RESPONSE } from "@myboothmanager/common";
import { InvalidRequestBodyException, RequestMaxSizeExceededException } from "@/lib/exceptions";
import UploadStorage from "@/db/models/uploadstorage";
import { create, generateRandomDigestFileName } from "@/lib/common-functions";
import { InternalKeysWithId } from "@/lib/types";
import ImageManipulator from "@/lib/image-manipulation";

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

  async writeBufferAsFileTo(buffer: Buffer, fileName: string, subpath?: string): Promise<string> {
    const filePath = await this.getFileUploadPath(fileName, subpath);
    return new Promise<string>((resolve, reject) => {
      try {
        const stream = createWriteStream(filePath, { flags: "w", autoClose: true });
        stream.write(buffer);
        stream.end().close();
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

  async processImageUpload<TModel extends Model>(
    targetModelInstance: TModel,
    targetModelImageIdColumnKey: keyof TModel,
    file: MultipartFile,
    fileSaveSubpath: string,
    imageSizeConstraint: ImageSizeConstraintKey,
    callerAccountId: number): Promise<IValueResponse> {
    /* #1. Remove existing image if exists */
    if(targetModelInstance[targetModelImageIdColumnKey]) {
      // Do not try-catch here; ignore the file nonexistence
      const existingUpload = await UploadStorage.findByPk(targetModelInstance[targetModelImageIdColumnKey] as number);
      if(existingUpload) {
        await this.removeFile(existingUpload.fileName, existingUpload.savePath);
        await existingUpload.destroy({ force: true });
      }
    }

    /* #2. Image manipulation */
    const manipulator = new ImageManipulator(await file.toBuffer());
    await manipulator.resizeAndCrop(imageSizeConstraint);

    const imageWebpBuffer = Buffer.from(await (await manipulator.toWebP()).arrayBuffer());
    const imageJpgBuffer  = Buffer.from(await (await manipulator.toJPG()).arrayBuffer());
    const imageThumbnailBase64 = await manipulator.toThumbnailBase64();

    manipulator.close();

    /* #3. Save manipulated image file to disk */
    const digest = generateRandomDigestFileName();
    try {
      await this.writeBufferAsFileTo(imageWebpBuffer, digest.withExt("webp"), fileSaveSubpath);
      await this.writeBufferAsFileTo(imageJpgBuffer, digest.withExt("jpg"), fileSaveSubpath);
    } catch(err) {
      console.error(err);
      throw new InternalServerErrorException();  // TODO: custom exception
    }

    /* #4. Create new upload record & return upload file path */
    try {
      const upload = await (await create(UploadStorage, {
        ownerId: callerAccountId,
        savePath: fileSaveSubpath,
        fileName: digest.withExt("webp"),
        extensions: ["webp", "jpg"],
        imageThumbnailBase64,
      } as Omit<IUploadStorage, InternalKeysWithId>)).save();

      await targetModelInstance.update({ [targetModelImageIdColumnKey]: upload.id });

      return {
        value: upload.filePath,
      };
    } catch(err) {
      console.error(err);
      throw new InternalServerErrorException();  // TODO: custom exception
    }
  }

  async processImageDelete<TModel extends Model>(
    targetModelInstance: TModel,
    targetModelImageIdColumnKey: keyof TModel): Promise<ISuccessResponse> {
    /* #1. Remove existing images if exists */
    if(targetModelInstance[targetModelImageIdColumnKey]) {
      // Do not try-catch here; ignore the file nonexistence
      const existingUpload = await UploadStorage.findByPk(targetModelInstance[targetModelImageIdColumnKey] as number);
      if(existingUpload) {
        const targetFileNames = [];
        if(existingUpload.extensions) {
          targetFileNames.push(...existingUpload.extensions.map((ext) => existingUpload.fileName.replace(/\.[^.]+$/, `.${ext}`)));
        }

        for(const fileName of targetFileNames) {
          await this.removeFile(fileName, existingUpload.savePath);
        }

        await existingUpload.destroy({ force: true });
      }
    }

    /* #2. Set image id to null & return success response */
    targetModelInstance.set(targetModelImageIdColumnKey, null);
    await targetModelInstance.save();

    return SUCCESS_RESPONSE;
  }
}
