import type { App, ComponentCustomProperties } from "vue";
import * as IC from "./components/index.internal";
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

    app.component("BoothMemberItem", IC.BoothMemberItemComponent);
    app.component("BoothMemberAvatar", IC.BoothMemberAvatarComponent);

    app.component("CommonDialog", IC.CommonDialogComponent);
    app.component("CommonErrorDialog", IC.CommonErrorDialogComponent);
    app.component("CommonWarningDialog", IC.CommonWarningDialogComponent);
    app.component("ServerDataLoadErrorDialog", IC.ServerDataLoadErrorDialogComponent);
    app.component("ServerNotRespondErrorDialog", IC.ServerNotRespondErrorDialogComponent);
    app.component("DatePickerDialog", IC.DatePickerDialogComponent);

    app.component("GoodsItem", IC.GoodsItemComponent);
    app.component("GoodsCategoryTitle", IC.GoodsCategoryTitleComponent);
    app.component("GoodsListView", IC.GoodsListViewComponent);

    app.component("GlobalSnackbarStack", IC.GlobalSnackbarStackComponent);
    app.component("MarkdownRenderer", IC.MarkdownRendererComponent);
  },
};

export * from "./plugins/vuetify";
export * from "./components";
export * from "./entities";
