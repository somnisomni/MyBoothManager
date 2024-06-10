import { ref, type Ref } from "vue";

/* Part of https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/util/anchor.ts#L8-L14 */
const block = ["top", "bottom"] as const;
const inline = ["start", "end", "left", "right"] as const;
type Tblock = typeof block[number];
type Tinline = typeof inline[number];
type VuetifyAnchor =
  | Tblock
  | Tinline
  | "center"
  | "center center"
  | `${Tblock} ${Tinline | "center"}`
  | `${Tinline} ${Tblock | "center"}`;

export interface ISnackbarContext {
  id: string;
  type: "plain" | "info" | "success" | "error" | "warning" | "loading";
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
  closeOnBack?: boolean;
  closeOnContentClick?: boolean;
}

export class SnackbarContextWrapper {
  private _contexts: Array<ISnackbarContext> = [];

  get contexts(): Ref<Array<ISnackbarContext>> {
    return ref(this._contexts);
  }

  add(context: Omit<ISnackbarContext, "id">): ReturnType<typeof crypto.randomUUID> {
    let id;
    this._contexts.push({
      id: id = crypto.randomUUID(),
      ...context,
    });

    return id;
  }

  async addLoading<T>(context: Omit<ISnackbarContext, "id" | "type" | "persistent">, loadingFunc: () => Promise<T>): Promise<T> {
    const id = this.add({
      ...context,
      type: "loading",
      persistent: true,
    });

    const result = await loadingFunc();

    this.removeImmediate(id);

    return result;
  }

  removeImmediate(id: string): void {
    const context = this._contexts.find((context) => context.id === id);

    if(context) {
      context.timeout = 0;
    }
  }
}
