import "@mdi/font/css/materialdesignicons.css";
import "@/styles/vuetify.scss";
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { APP_PRIMARY_COLOR, APP_SECONDARY_COLOR } from "@myboothmanager/common-ui";

export default createVuetify({
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: { mdi },
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: APP_PRIMARY_COLOR,
          secondary: APP_SECONDARY_COLOR,
        },
      },
    },
  },
});
