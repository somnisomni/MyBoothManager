import { default as Sharp } from "sharp";
import { ImageManipulationException, InvalidImageException } from "./image-manipulation.exception";

export default class ImageManipulator {
  private imageInstance: Sharp.Sharp;

  constructor(input: ArrayBuffer) {
    try {
      this.imageInstance = Sharp(input, {
        limitInputPixels: 0x1FFF * 0x1FFF,  // 8191 * 8191
        ignoreIcc: true,
      });
    } catch(e) {
      throw new InvalidImageException();
    }
  }

  /**
   * Do resize the image to the given width and height, with "cover" fitting
   * @param widthLimit
   * @param heightLimit
   * @returns {{ width: number, height: number }} Resized width and height
   * @throws {ImageManipulationException} When the image manipulation failed
   */
  async resizeAndCrop(widthLimit: number, heightLimit: number): Promise<{ width: number, height: number }> {
    try {
      return await new Promise((resolve) => {
        this.imageInstance.resize(widthLimit, heightLimit, {
          fit: "cover",
          position: "center",
          kernel: "lanczos3",
        });

        this.imageInstance.metadata().then((metadata) => {
          resolve({ width: metadata.width!, height: metadata.height! });
        });
      });
    } catch(e) {
      throw new ImageManipulationException();
    }
  }

  async toWebP(): Promise<Blob> {
    try {
      return new Blob([await this.imageInstance.clone().webp({
        quality: 95,
        nearLossless: true,
        smartSubsample: true,
      }).withExif({}).toBuffer()]);
    } catch(e) {
      throw new ImageManipulationException();
    }
  }

  async toJPG(): Promise<Blob> {
    try {
      return new Blob([await this.imageInstance.clone().jpeg({
        quality: 95,
        progressive: true,
        optimizeCoding: true,
        optimizeScans: true,
        mozjpeg: true,
      }).withExif({}).toBuffer()]);
    } catch(e) {
      throw new ImageManipulationException();
    }
  }

  async toThumbnailBase64(width: number = 32, height: number = 32): Promise<string> {
    try {
      return await new Promise((resolve) => {
        this.imageInstance.resize(width, height, {
          fit: "cover",
          position: "center",
          kernel: "lanczos3",
        }).png().toBuffer().then((buffer) => {
          resolve("data:image/png;base64," + buffer.toString("base64"));
        });
      });
    } catch(e) {
      throw new ImageManipulationException();
    }
  }
}
