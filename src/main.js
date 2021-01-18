import Vue from "vue";
import router from "./route";
import store from "./store";
import i18n from "./locale";
import App from "./App.vue";
import meta from "./meta_json";

// 公共模块
import utils from "./utils";
import "./plugins";
import "./components/common";
import "./directive";
import "./filter";
import "./server";

Vue.config.productionTip = true;

import mockStart from './mock';
if(process.env.NODE_ENV === 'development'){
 mockStart();
}

const Bus = new Vue();

window.$app = new Vue({
  router,
  store,
  i18n,
  data() {
    return {
      ...meta,
      Bus
    };
  },
  methods: {
    ...utils
  },
  render: h => h(App)
}).$mount("#app");
