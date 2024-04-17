import { IDataModelBase } from "@myboothmanager/common";

export type InternalKeys = "createdAt" | "updatedAt" | "deletedAt";
export type InternalKeysWithId = InternalKeys | "id";

export interface IUploadStorage extends IDataModelBase {
  id: number;
  ownerId: number;  // Foreign key to Account.id

  //          |---------- Up to backend logic ---------||- 1 -||--- 2 ---||3|
  // example) https://cdn.myboothmanager.example/uploads/booth/banner-1_2.png
  // (1) savePath: directory path from upload folder to folder containing the file, null means it's saved in root of upload folder (equivalent to '/')
  // (2) fileName
  // (3) extensions: file extensions, in order of preference
  savePath?: string;
  fileName: string;
  extensions?: Array<string>;
  imageThumbnailBase64?: string;
}
