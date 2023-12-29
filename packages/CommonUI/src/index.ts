import { type App } from "vue";
import * as C from "./components";
import "@/styles/styles.scss";

export default {
  install(app: App) {
    app.component("CommonDialog", C.CommonDialog);
    app.component("CommonErrorDialog", C.CommonErrorDialog);
    app.component("CommonWarningDialog", C.CommonWarningDialog);
    app.component("ServerDataLoadErrorDialog", C.ServerDataLoadErrorDialog);
    app.component("ServerNotRespondErrorDialog", C.ServerNotRespondErrorDialog);
    app.component("DatePickerDialog", C.DatePickerDialog);

    app.component("GoodsItem", C.GoodsItem);
    app.component("GoodsCategoryTitle", C.GoodsCategoryTitle);
    app.component("GoodsListView", C.GoodsListView);
    app.component("SelectableGoodsListView", C.SelectableGoodsListView);
  },
};

export {
  VUETIFY_COMMON_OPTIONS,
  APP_PRIMARY_COLOR,
  APP_SECONDARY_COLOR,
  BREAKPOINT_XXS,
  isDisplayXXS,
} from "./plugins/vuetify";
