import { createI18n } from 'vue-i18n';

// 导入翻译文件
import en from './locales/en.json';
import zh from './locales/zh.json';

const messages = {
  en: en,
  zh: zh
};

const i18n = createI18n({
  locale: 'zh', // 设置默认语言
  fallbackLocale: 'en', // 设置回退语言
  messages, // 设置语言包
});

export default i18n;
