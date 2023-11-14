/* DO NOT use wildcard export (export * from "./component.vue") as it causes error while building */
import CommonDialog, { type DialogButtonParams } from "./dialogs/CommonDialog.vue";

export {
  CommonDialog,
  type DialogButtonParams,
};
