import type { App } from "vue";
import * as C from "./components";

export default {
  install(app: App) {
    app.component("CommonDialog", C.CommonDialog);
    app.component("CommonErrorDialog", C.CommonErrorDialog);
    app.component("ServerDataLoadErrorDialog", C.ServerDataLoadErrorDialog);
    app.component("ServerNotRespondErrorDialog", C.ServerNotRespondErrorDialog);
  },
};
