import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ruTranslation from '../locales/ru/translation.json';

const initI18n = () => {
  i18n.use(initReactI18next).init({
    resources: {
      ru: {
        translation: ruTranslation,
      },
    },
    lng: 'ru',
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });
};

export default initI18n;
export { i18n };
