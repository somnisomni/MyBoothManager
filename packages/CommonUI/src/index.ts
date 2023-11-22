import type { App } from "vue";
import colors from "vuetify/util/colors";
import * as C from "./components";
import "@/styles/styles.scss";

export default {
  install(app: App) {
    app.component("CommonDialog", C.CommonDialog);
    app.component("CommonErrorDialog", C.CommonErrorDialog);
    app.component("CommonWarningDialog", C.CommonWarningDialog);
    app.component("ServerDataLoadErrorDialog", C.ServerDataLoadErrorDialog);
    app.component("ServerNotRespondErrorDialog", C.ServerNotRespondErrorDialog);
  },
};

export const APP_PRIMARY_COLOR: string = colors.teal.darken1;
export const APP_SECONDARY_COLOR: string = colors.teal.lighten3;
