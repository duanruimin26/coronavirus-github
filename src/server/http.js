import axios from "axios";
// import qs from "qs";
import { Message } from "element-ui";
import route from "@/route";

const timeout = 6 * 10000;
const instance = axios.create({
  baseURL: process.env.VUE_APP_BASEURL,
  timeout,
  headers: {
    "Content-Type": "application/json; charset=utf-8"
  },
  withCredentials: true
});
const CancelToken = axios.CancelToken;

// POST传参序列化(添加请求拦截器)
instance.interceptors.request.use(
  config => {//发送请求之前的操作
    let user = JSON.parse(window.sessionStorage.getItem('user'));
    if (user) {
      let token = user.token;
      config.headers.common['token'] = token;
    }
    config.cancelToken = new CancelToken(cancel => {
      window.$app.$store.state.axiosPromiseCancel.push(cancel);
    });
    return Promise.resolve(config);
  },
  (err = {}) => {
    if (!window.$app.getMessageLan(3)) {//限制提示框弹出个数，大于等于3时，getMessageLan(3)返回true
      Message.error(window.$app.$t("errorCode")["500"]);//提示"系统繁忙，请稍后再试！"
    }
    return Promise.reject(err.response);
  }
);
// 返回状态判断(添加响应拦截器)
instance.interceptors.response.use(
  res => {// 只有返回的状态码是2xx，都会进来这里
    if (res.status === 200) {
      return Promise.resolve(res);
    } else if (!window.$app.getMessageLan(3)) {
      Message.error(res.data.msg);//提示错误信息
    }
    return Promise.reject(res);
  },
  // http状态码非2开头的都会进来这里，如404,500等；
  //取消请求也会进入这里，CancelToken，可以用axios.isCancel(err)来判断是取消的请求
  (err = {}) => {
    const errorCode = window.$app.$t("errorCode");
    if (axios.isCancel(err)) {//取消请求
      return new Promise(() => {});
    } else if (err && err.response) {
      const { status, data } = err.response;
      switch (status) {
        case 401:
          route.replace({
            name: "login"
          });
          if (window.$app.getMessageLan()) {//弹窗个数大于等于1的时候return
            return;
          }
          // Message.error(errorCode[status]);
          Message.error(data.resMsg);
          window.$app.rmSs("user");
          window.$app.rmSs("menus");
          break;
        case 500:
          if (window.$app.getMessageLan(3)) {//弹窗个数大于等于3的时候return
            return;
          }
          Message.error(errorCode["500"]);
          break;
        default:
          if (
            window.$app.isObj(data) &&
            data.msg &&
            !window.$app.getMessageLan(3)
          ) {
            Message.error(data.msg);
          }
          break;
      }
    } else if (err.message.includes("timeout")) {
      Message.error(errorCode["timeout"]);
    } else {
      Message.error(errorCode["network"]);
    }
    return Promise.reject(err.response);
  }
);

const setHttp = method => (url, ...params) => {
  const [data, options = {}] = params;
  const config = {
    url,
    method,
    ...options
  };
  if (["post", "put", "patch"].includes(method)) {
    config.data = data;
  } else {
    config.params = data;
  }
  return new Promise((resolve, reject) => {
    instance(config)
      .then(
        (res = {}) => {
          resolve(res.data);
        },
        (err = {}) => {
          reject(err.data);
        }
      )
      .catch((err = {}) => {
        reject(err.data);
      });
  });//接口调用的时候，执行的就是这个new Promise
};

const upload = (url, config) => {

  const { progress } = config;
  const data = new FormData();

  Object.entries(config).forEach(([k,v])=>{
    if(k!=='progress' && k!=='files'){
      data.append(k,v);
    }else if(k==='files'){
      if (Array.isArray(v)) {
        v.forEach(item => {
          data.append(item.name, item.value ? item.value : item.file || "");
        });
      } else {
        data.append(v.name, v.file);
      }
    }
  })

  return setHttp("post")(url, data, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: e => {
      const completeProgress = ((e.loaded / e.total) * 100) | 0;
      if (progress) {
        progress(completeProgress);
      }
    },
    cancelToken: new CancelToken(c => {
      window.$app.$store.state.axiosPromiseCancel.push(c);
    }),
    timeout: timeout * 10 //文件上传的超时时间为10分钟
  });
};

export default {
  post: setHttp("post"),
  get: setHttp("get"),
  put: setHttp("put"),
  delete: setHttp("delete"),
  patch: setHttp("patch"),
  upload
};
