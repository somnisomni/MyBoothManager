/* DO NOT use wildcard export (export * from "./component.vue") as it causes error while building */
export { default as CommonDialog, type CommonDialogButtonParams } from "./dialogs/common/CommonDialog.vue";
export { default as CommonErrorDialog } from "./dialogs/common/CommonErrorDialog.vue";
export { default as CommonWarningDialog } from "./dialogs/common/CommonWarningDialog.vue";
export { default as ServerDataLoadErrorDialog } from "./dialogs/errors/ServerDataLoadErrorDialog.vue";
export { default as ServerNotRespondErrorDialog } from "./dialogs/errors/ServerNotRespondErrorDialog.vue";
