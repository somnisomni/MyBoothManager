import { createApp } from "vue";
import { createPinia } from "pinia";
import CommonUI from "@myboothmanager/common-ui";

import "@myboothmanager/common-ui/dist/style.css";
import "@/styles/styles.scss";

import App from "./App.vue";
import router from "./plugins/router";
import vuetify from "./plugins/vuetify";


const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(vuetify);
app.use(CommonUI);

app.mount("#app");
