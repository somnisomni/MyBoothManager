import "fastify";
import "@fastify/multipart";

/* Copied from @fastify/multipart typings (https://github.com/fastify/fastify-multipart/blob/master/types/index.d.ts) */
declare module "fastify" {
  interface FastifyRequest {
    isMultipart: () => boolean;

    // promise api
    parts: (
      options?: Omit<BusboyConfig, "headers">
    ) => AsyncIterableIterator<fastifyMultipart.Multipart>;

    // Stream mode
    file: (
      options?: Omit<BusboyConfig, "headers">
    ) => Promise<fastifyMultipart.MultipartFile | undefined>;
    files: (
      options?: Omit<BusboyConfig, "headers">
    ) => AsyncIterableIterator<fastifyMultipart.MultipartFile>;

    // Disk mode
    saveRequestFiles: (
      options?: Omit<BusboyConfig, "headers"> & { tmpdir?: string }
    ) => Promise<Array<fastifyMultipart.SavedMultipartFile>>;
    cleanRequestFiles: () => Promise<void>;
    tmpUploads: Array<string> | null;
    /** This will get populated as soon as a call to `saveRequestFiles` gets resolved. Avoiding any future duplicate work */
    savedRequestFiles: Array<fastifyMultipart.SavedMultipartFile> | null;
  }

  interface FastifyInstance {
    multipartErrors: MultipartErrors;
  }
}
