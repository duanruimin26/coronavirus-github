import Vue from "vue";
import VueI18n from "vue-i18n";
import ElementLocale from "element-ui/lib/locale";
import enLocale from "element-ui/lib/locale/lang/en";
import zhLocale from "element-ui/lib/locale/lang/zh-CN";
import enUS from "./lang/en_us/index";
import zhCN from "./lang/zh_cn/index";

const messages = {
  "en-us": {
    ...enLocale,
    ...enUS
  },
  "zh-cn": {
    ...zhLocale,
    ...zhCN
  }
};

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: "zh-cn",
  messages
});

// element 国际化
ElementLocale.i18n((key, value) => i18n.t(key, value));

export default i18n;
