/* Part of https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/util/anchor.ts#L8-L14 */
const block = ["top", "bottom"] as const;
const inline = ["start", "end", "left", "right"] as const;
type Tblock = typeof block[number]
type Tinline = typeof inline[number]
type VuetifyAnchor =
  | Tblock
  | Tinline
  | "center"
  | "center center"
  | `${Tblock} ${Tinline | "center"}`
  | `${Tinline} ${Tblock | "center"}`

export interface ISnackbarContext {
  id: string;
  type: "plain" | "info" | "success" | "error" | "warning";
  persistent?: boolean;
  prependIcon?: string;

  /* Below is the part of SnackbarMessage, see https://vuetifyjs.com/en/api/v-snackbar-queue/#props-model-value */
  text: string;
  timeout?: number;
  location?: VuetifyAnchor;
  offset?: string | number;
  width?: string | number;
  height?: string | number;
  disabled?: boolean;
}
