import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { messages_en, messages_vi, messages_ja } from "./index";

const messages = {
  en: messages_en,
  vn: messages_vi,
  jp: messages_ja
};

i18next.use(initReactI18next).init({
  interpolation: { escapeValue: false }, // React already does escaping
  lng: "vn", // language to use
  resources: {
    vn: {
      translation: messages.vn
    },
    en: {
      translation: messages.en // 'common' is our custom namespace
    },
    jp: {
      translation: messages.jp // 'common' is our custom namespace
    }
  },
  debug: process.env.NODE_ENV !== "production",
  fallbackLng: "jp"
});

export default i18next;
