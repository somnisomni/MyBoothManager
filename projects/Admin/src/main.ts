/* eslint-disable import-x/order */

import CommonUI from "@myboothmanager/common-ui";
import { createPinia } from "pinia";
import piniaPersistedState from "pinia-plugin-persistedstate";
import { createApp } from "vue";

import "@myboothmanager/common-ui/dist/common-ui.css";
import "@/styles/styles.scss";

import App from "./App.vue";
import { getUploadFileUrl } from "./lib/functions";
import router from "./plugins/router";
import vuetify from "./plugins/vuetify";

/* *====* */

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPersistedState);

app.use(pinia);
app.use(router);
app.use(vuetify);
app.use(CommonUI, { imageUrlResolver: getUploadFileUrl });

app.mount("#app");
