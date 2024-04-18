import type { VuetifyOptions } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { ko, en } from "vuetify/locale";
import colors from "vuetify/util/colors";

export const APP_PRIMARY_COLOR: string = colors.teal.darken1;
export const APP_SECONDARY_COLOR: string = colors.teal.lighten3;

export const BREAKPOINT_XXS: number = 400;
export function isDisplayXXS(width: number): boolean {
  return width < BREAKPOINT_XXS;
}

export const VUETIFY_COMMON_OPTIONS: VuetifyOptions = {
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
};
