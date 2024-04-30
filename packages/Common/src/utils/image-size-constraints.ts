export enum ImageSizeConstraintKey {
  BOOTH_BANNER,
  BOOTH_INFO,
  BOOTH_MEMBER_AVATAR,
  GOODS,
}

export const IMAGE_SIZE_CONSTRAINTS: ReadonlyMap<ImageSizeConstraintKey, { width: number, height: number, fit: "cover" | "outside" }> = new Map([
  [ImageSizeConstraintKey.BOOTH_BANNER,        { width: 1, height: 600, fit: "outside" }],
  [ImageSizeConstraintKey.BOOTH_INFO,          { width: 1500, height: 1, fit: "outside" }],
  [ImageSizeConstraintKey.BOOTH_MEMBER_AVATAR, { width: 300, height: 300, fit: "cover" }],
  [ImageSizeConstraintKey.GOODS,               { width: 1500, height: 500, fit: "cover" }],
]);
