import Vue from "vue";
import Router from "vue-router";
import routes from "./routes";
import tools from "@/utils/tools";

Vue.use(Router);

// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location, onResolve, onReject) {
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
//   return originalPush.call(this, location).catch(err => err)
// }

const { children } = routes[2];
const userId = tools.getCk("userId");

const loaderMenus = to => {
  const menus = tools.getSs("menus") || [];
  const firstLevel = menus.filter(v => v.split(".").length === 1);//一级菜单
  const secondaryLevel = menus.reduce((list, v) => {
    const [...rest] = v.split(".");
    if (rest.length > 1) {
      list.push(`${rest[0]}.${rest[1]}`);
    }
    return list;
  }, []);//二级菜单
  const [...names] = (to.name || "").split(".");
  return {
    firstLevel,
    secondaryLevel,
    names: to.name ? names : [] //即将进入路由的名称
  };
};

const loaderSecondaryRoute = (firstLevel, secondaryLevel, key, name) =>
  children.reduce((route, v) => {
    if (v[key] === name) {
      if (v.children) {
        v.children.forEach(_v => {
          if (_v.name !== name && secondaryLevel.includes(_v.name) && !route) {
            route = _v;
          }
        });
      }
      if (firstLevel.includes(v.name) && !route) {
        route = v;
      }
    }
    return route;
  }, "");

const router = new Router({
  mode: "hash",
  base: "",
  routes
});

router.beforeEach((to, from, next) => {//全局前置守卫
  if (window.$app) {
    const { $store } = window.$app;
    $store.state.axiosPromiseCancel.forEach(cancel => {
      cancel && cancel();
    });
    $store.state.axiosPromiseCancel = [];
  }
  const { firstLevel, secondaryLevel, names } = loaderMenus(to);

  if (names.length > 1) {
    const name = `${names[0]}.${names[1]}`;
    if (firstLevel.length || secondaryLevel.length) {
      if (firstLevel.includes(names[0]) || secondaryLevel.includes(name)) {
        next();
      } else if (
        to.redirectedFrom &&
        to.redirectedFrom !== "/coronavirusTestSystem"
      ) {
        const parentPath = to.redirectedFrom.replace(
          "/coronavirusTestSystem/",
          ""
        );
        const route = loaderSecondaryRoute(
          firstLevel,
          secondaryLevel,
          "path",
          parentPath
        );
        next(route || routes[2]);
      } else if (firstLevel.length || secondaryLevel.length) {
        let route = "";
        if (
          firstLevel.includes(names[0]) ||
          secondaryLevel.includes(names[0])
        ) {
          route = loaderSecondaryRoute(
            firstLevel,
            secondaryLevel,
            "name",
            names[0]
          );
        } else {
          route = loaderSecondaryRoute(
            firstLevel,
            secondaryLevel,
            "name",
            firstLevel[0] || secondaryLevel[0]
          );
        }
        next(route || routes[2]);
      }
    } else if (tools.isDef(userId)) {
      next();
    } else {
      next(routes[1]);//进入登录页
    }
  } else {
    next();
  }
});

export default router;
