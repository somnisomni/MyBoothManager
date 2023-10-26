/* eslint-disable @typescript-eslint/no-explicit-any */

export function emptyObject(target: Record<any, any>): void {
  Object.keys(target).forEach((key) => delete target[key]);
}

export function emptyNumberKeyObject(target: Record<number, any>): void {
  Object.keys(target).forEach((key) => delete target[parseInt(key)]);
}
