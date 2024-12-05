import { default as Sharp } from "sharp";
import { IMAGE_SIZE_CONSTRAINTS, ImageSizeConstraintKey } from "@myboothmanager/common";
import { ImageManipulationException, InvalidImageException } from "./image-manipulation.exception";

export default class ImageManipulator {
  private imageInstance: Sharp.Sharp;

  constructor(input: ArrayBuffer) {
    try {
      this.imageInstance = this.createInstanceFromBuffer(Buffer.from(input));
    } catch(e) {
      console.error(e);
      throw new InvalidImageException();
    }
  }

  private createInstanceFromBuffer(buffer: Buffer): Sharp.Sharp {
    return Sharp(buffer, {
      limitInputPixels: 0x1FFF * 0x1FFF,  // 8191 * 8191
      ignoreIcc: true,
    });
  }

  /**
   * Do resize the image to the given width and height, with "cover" fitting
   * @param widthLimit
   * @param heightLimit
   * @returns {{ width: number, height: number }} Resized width and height
   * @throws {ImageManipulationException} When the image manipulation failed
   */
  private async _resizeAndCrop(constraint: NonNullable<ReturnType<(typeof IMAGE_SIZE_CONSTRAINTS)["get"]>>): Promise<{ width: number, height: number }> {
    let width: number, height: number;

    try {
      const metadata = await this.imageInstance.metadata();
      if(!metadata || !metadata.width || !metadata.height) throw new InvalidImageException();

      width = metadata.width!;
      height = metadata.height!;
    } catch(e) {
      console.error(e);
      throw new InvalidImageException();
    }

    if(constraint.fit === "cover" && constraint.coverAspectRatio) {
      width = height * constraint.coverAspectRatio;
    }

    try {
      this.imageInstance = this.createInstanceFromBuffer(
        await this.imageInstance.resize(Math.min(width, constraint.width), Math.min(height, constraint.height), {
          fit: constraint.fit,
          position: "center",
          kernel: "lanczos3",
        }).toBuffer());

      return new Promise((resolve) => {
        this.imageInstance.metadata().then((metadata) => {
          resolve({ width: metadata.width!, height: metadata.height! });
        });
      });
    } catch(e) {
      console.error(e);
      throw new ImageManipulationException();
    }
  }

  async resizeAndCrop(constraintKey: ImageSizeConstraintKey): Promise<{ width: number, height: number }> {
    const constraint = IMAGE_SIZE_CONSTRAINTS.get(constraintKey);
    if(!constraint) throw new ImageManipulationException();

    return await this._resizeAndCrop(constraint);
  }

  async toWebP(): Promise<Blob> {
    try {
      return new Blob([await this.imageInstance.clone().flatten({ background: { r: 255, g: 255, b: 255 }}).webp({
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
      return new Blob([await this.imageInstance.clone().flatten({ background: { r: 255, g: 255, b: 255 }}).jpeg({
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

  /**
   * Default size 16x16
   */
  async toThumbnailBase64(width: number = 16, height: number = 16): Promise<string> {
    try {
      return await new Promise((resolve) => {
        this.imageInstance.clone().resize(width, height, {
          fit: "cover",
          position: "center",
          kernel: "lanczos3",
        }).flatten({ background: { r: 255, g: 255, b: 255 }}).png().toBuffer().then((buffer) => {
          resolve("data:image/png;base64," + buffer.toString("base64"));
        });
      });
    } catch(e) {
      throw new ImageManipulationException();
    }
  }

  close() {
    this.imageInstance.destroy();
  }
}
