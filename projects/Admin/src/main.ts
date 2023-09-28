import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPersistedState from "pinia-plugin-persistedstate";

import "@/styles/styles.scss";

import CommonDialog from "@/components/dialogs/common/CommonDialog.vue";

import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";


const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPersistedState);

app.use(pinia);
app.use(router);
app.use(vuetify);

app.component("CommonDialog", CommonDialog);

app.mount("#app");
