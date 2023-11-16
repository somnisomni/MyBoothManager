import "@mdi/font/css/materialdesignicons.css";
import "@/styles/vuetify.scss";
import { createVuetify } from "vuetify";
import colors from "vuetify/util/colors";
import { aliases, mdi } from "vuetify/iconsets/mdi";

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
          primary: colors.teal.darken1,
          secondary: colors.teal.lighten3,
        },
      },
    },
  },
});
