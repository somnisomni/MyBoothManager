import "@mdi/font/css/materialdesignicons.css";
import "@/assets/styles/vuetify.scss";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { VUETIFY_COMMON_OPTIONS } from "@myboothmanager/common-ui";

export default defineNuxtPlugin((app) => {
  app.vueApp.use(createVuetify(VUETIFY_COMMON_OPTIONS));
});
