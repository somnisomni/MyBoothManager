import type { App, ComponentCustomProperties } from "vue";
import * as C from "./components";
import "@/styles/styles.scss";

// FIXME: THIS DECLARATION SEEMS NOT PROPAGATE TO OUR SOURCE CODE FOR NOW
// SHIT I DUNNO WHAT'S THE PROBLEM
// Refer `src/components/goods/GoodsItem.vue` for workaround for this typing
declare module "vue" {
  interface ComponentCustomProperties {
    $imageUrlResolver: (rawPath?: string | null) => string | null;
  }
}

export interface ICommonUIOptions {
  imageUrlResolver: ComponentCustomProperties["$imageUrlResolver"];
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
