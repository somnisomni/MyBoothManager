import { IDataModelBase } from "./base";

export interface IUploadStorage extends IDataModelBase {
  id: number;
  ownerId: number;  // Foreign key to Account.id
  
  //          |---------- Up to backend logic ---------||- 1 -||----- 2 ----| 
  // example) https://cdn.myboothmanager.example/uploads/booth/banner-1_2.png
  // (1) savePath: directory path from upload folder to folder containing the file, null means it's saved in root of upload folder (equivalent to '/')
  // (2) fileName
  savePath?: string;
  fileName: string;
}

// No request/response interfaces because it's not intended to be used as frontend->backend API call
