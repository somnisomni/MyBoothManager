export interface IDataModelBase {}

export interface IBackendErrorResponse {
  message: string;
  timestamp: string;
  path: string;
  statusCode: number;
}
