import { prefix } from "@/meta_json";

const routerContext = require.context("./", true, /\.js$/);//自动化导入模块
const children = routerContext.keys().reduce((list, route) => {
  if (!route.startsWith("./index")) {
    const routeModule = routerContext(route);//获取对应文件的模块名
    list.push(routeModule.default);
  }
  return list;
}, []);

export default [
  {
    path: "/",
    redirect: prefix
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/login/index.vue")
  },
  {
    path: prefix,
    name: "coronavirusTestSystem",
    redirect: `${prefix}/dashboard`,
    component: () =>
      import(/* webpackChunkName: "main" */ "@/views/main/main.vue"),
    children
  }
];
