import CommonForm from "@/components/common/CommonForm.vue";
import FileInputButton from "@/components/common/FileInputButton.vue";
import ImageWithUpload from "@/components/common/ImageWithUpload.vue";
import type { App } from "vue";

export default {
  install(app: App) {
    app.component("CommonForm", CommonForm);
    app.component("FileInputButton", FileInputButton);
    app.component("ImageWithUpload", ImageWithUpload);
  },
};
