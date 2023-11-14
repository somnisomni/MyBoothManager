import type { App } from "vue";
import { CommonDialog } from "./components";

export default {
  install(app: App) {
    app.component("CommonDialog", CommonDialog);
  },
};
