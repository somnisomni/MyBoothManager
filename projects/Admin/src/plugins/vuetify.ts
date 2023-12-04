import "@mdi/font/css/materialdesignicons.css";
import "@/styles/vuetify.scss";
import { createVuetify, type VuetifyOptions } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { ko, en } from "vuetify/locale";
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
  locale: {
    locale: "ko",
    fallback: "en",
    messages: { ko, en },
  },
} as VuetifyOptions);
