
export default {
  // 1.首页
  path: "dashboard",
  name: "dashboard",
  meta: { title: '首页' },
  component: () =>
    import(
      /* webpackChunkName: "dashboard" */ "@/views/dashboard/index.vue"
    )
};
