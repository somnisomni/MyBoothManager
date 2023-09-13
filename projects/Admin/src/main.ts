import { createApp } from "vue";
import { createPinia } from "pinia";

import "@/styles/styles.scss";

import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import VueCookies from "vue-cookies";

const app = createApp(App);
app.use(VueCookies, { expires: "2d", sameSite: "lax" });
app.use(createPinia());
app.use(router);
app.use(vuetify);
app.mount("#app");
