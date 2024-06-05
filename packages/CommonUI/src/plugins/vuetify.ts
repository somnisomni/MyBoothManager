import type { VuetifyOptions } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { ko, en } from "vuetify/locale";

export const APP_PRIMARY_COLOR: string = "#00AB86";   // Main   (colors below are determined in Adobe Color)
export const APP_SECONDARY_COLOR: string = "#1D5649"; // Monochromatic of main color
export const APP_INFO_COLOR: string = "#0061AB";      // Analogous of main color
export const APP_ERROR_COLOR: string = "#AB0E00";     // Split-complementary of main color
export const APP_WARNING_COLOR: string = "#FF6F00";   // Analogus of error color with 100% brightness

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
          success: APP_PRIMARY_COLOR,
          info: APP_INFO_COLOR,
          error: APP_ERROR_COLOR,
          warning: APP_WARNING_COLOR,
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
