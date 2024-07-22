import type { App } from "vue";
import * as C from "./components";
import "@/styles/styles.scss";

export interface ICommonUIOptions {
  imageUrlResolver: (rawPath?: string | null) => string | null;
}

export default {
  install(app: App, options: ICommonUIOptions) {
    app.config.globalProperties.$imageUrlResolver = options?.imageUrlResolver ?? ((rawPath?: string | null) => rawPath);

    app.component("BoothMemberItem", C.BoothMemberItem);
    app.component("BoothMemberAvatar", C.BoothMemberAvatar);

    app.component("CommonDialog", C.CommonDialog);
    app.component("CommonErrorDialog", C.CommonErrorDialog);
    app.component("CommonWarningDialog", C.CommonWarningDialog);
    app.component("ServerDataLoadErrorDialog", C.ServerDataLoadErrorDialog);
    app.component("ServerNotRespondErrorDialog", C.ServerNotRespondErrorDialog);
    app.component("DatePickerDialog", C.DatePickerDialog);

    app.component("GoodsItem", C.GoodsItem);
    app.component("GoodsCategoryTitle", C.GoodsCategoryTitle);
    app.component("GoodsListView", C.GoodsListView);

    app.component("GlobalSnackbarStack", C.GlobalSnackbarStack);
  },
};

export * from "./plugins/vuetify";
export * from "./components";
export * from "./entities";
