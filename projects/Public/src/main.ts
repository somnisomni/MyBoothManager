import { createApp } from "vue";
import { createPinia } from "pinia";
import { createHead } from "@unhead/vue";
import piniaPersistedState from "pinia-plugin-persistedstate";
import CommonUI from "@myboothmanager/common-ui";

import "@myboothmanager/common-ui/dist/style.css";
import "@/styles/styles.scss";

import App from "./App.vue";
import router from "./plugins/router";
import vuetify from "./plugins/vuetify";


const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPersistedState);

app.use(pinia);
app.use(createHead());
app.use(router);
app.use(vuetify);
app.use(CommonUI);

app.mount("#app");
