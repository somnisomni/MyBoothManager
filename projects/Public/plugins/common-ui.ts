import "@myboothmanager/common-ui/dist/common-ui.css";
import CommonUI from "@myboothmanager/common-ui";

export default defineNuxtPlugin((app) => {
  app.vueApp.use(CommonUI, { imageUrlResolver: getUploadFileUrl });
});
