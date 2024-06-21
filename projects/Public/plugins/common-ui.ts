import "@myboothmanager/common-ui/dist/style.css";
import CommonUI from "@myboothmanager/common-ui";

export default defineNuxtPlugin((app) => {
  app.vueApp.use(CommonUI);
});
