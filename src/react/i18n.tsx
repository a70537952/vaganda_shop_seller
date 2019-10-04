import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-xhr-backend";
import { initReactI18next } from "react-i18next";
import enGlobal from "../lang/en/global.json";
import enSeller from "../lang/en/seller.json";
import enPermission from "../lang/en/permission.json";
import enNotificationSetting from "../lang/en/notificationSetting.json";
import zhGlobal from "../lang/zh/global.json";
import zhSeller from "../lang/zh/seller.json";
import zhPermission from "../lang/zh/permission.json";
import zhNotificationSetting from "../lang/zh/notificationSetting.json";

// not like to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

const resources = {
  en: {
    global: enGlobal,
    seller: enSeller,
    permission: enPermission,
    notificationSetting: enNotificationSetting
  },
  zh: {
    global: zhGlobal,
    seller: zhSeller,
    permission: zhPermission,
    notificationSetting: zhNotificationSetting
  }
};

i18n
  // load translation using xhr -> see /public/locales
  // learn more: https://github.com/i18next/i18next-xhr-backend
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  //.use(initReactI18n)
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources: resources,
    fallbackLng: 'en',
    debug: false,
    ns: ['seller', 'global', 'permission'],
    defaultNS: 'seller',
    keySeparator: '::',
    nsSeparator: '$$',
    initImmediate: false,
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    },
    react: { useSuspense: false }
  });

export default i18n;
