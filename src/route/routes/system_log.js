import { prefix } from "@/meta_json";

export default {
  // 5.系统日志
  path: "systemLog",
  name: "systemLog",
  redirect: `${prefix}/systemLog/list`,
  component: () =>
    import(
      /* webpackChunkName: "system_log/index" */ "@/views/system_log/index.vue"
    ),
  children: [
    {
      path: "list",
      name: "systemLog.list",
      meta: { title: '系统日志' },
      component: () =>
        import(
          /* webpackChunkName: "system_log/list" */ "@/views/system_log/list/list.vue"
        )
    }
  ]
};