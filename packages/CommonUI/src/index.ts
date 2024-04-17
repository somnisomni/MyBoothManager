import type { App } from "vue";
import * as C from "./components";
import "@/styles/styles.scss";

export default {
  install(app: App) {
    app.component("BoothMemberItem", C.BoothMemberItem);

    app.component("CommonDialog", C.CommonDialog);
    app.component("CommonErrorDialog", C.CommonErrorDialog);
    app.component("CommonWarningDialog", C.CommonWarningDialog);
    app.component("ServerDataLoadErrorDialog", C.ServerDataLoadErrorDialog);
    app.component("ServerNotRespondErrorDialog", C.ServerNotRespondErrorDialog);
    app.component("DatePickerDialog", C.DatePickerDialog);

    app.component("GoodsItem", C.GoodsItem);
    app.component("GoodsCategoryTitle", C.GoodsCategoryTitle);
    app.component("GoodsListView", C.GoodsListView);
  },
};

export * from "./plugins/vuetify";
export * from "./components";
export * from "./entities";
