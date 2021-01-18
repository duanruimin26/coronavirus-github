import { prefix } from "@/meta_json";

export default {
  // 1.系统设置
  path: "systemSettings",
  name: "systemSettings",
  redirect: `${prefix}/systemSettings/userManage`,
  component: () =>
    import(
      /* webpackChunkName: "system_settings/index" */ "@/views/system_settings/index.vue"
    ),
  children: [
    {
      path: "systemParam",
      name: "systemSettings.systemParam",
      meta: { title: '系统参数' },
      component: () =>
        import(
          /* webpackChunkName: "system_settings/system_param" */ "@/views/system_settings/system_param/index.vue"
        )
    },
    {
      path: "userManage",
      name: "systemSettings.userManage",
      meta: { title: '用户管理' },
      component: () =>
        import(
          /* webpackChunkName: "system_settings/user_manage" */ "@/views/system_settings/user_manage/index.vue"
        )
    },
    {
      path: "roleManage",
      name: "systemSettings.roleManage",
      meta: { title: '角色管理' },
      component: () =>
        import(
          /* webpackChunkName: "system_settings/role_manage" */ "@/views/system_settings/role_manage/index.vue"
        )
    },
    {
      path: "operationLogs",
      name: "systemSettings.operationLogs",
      meta: { title: '系统日志' },
      component: () =>
        import(
          /* webpackChunkName: "system_log/list" */ "@/views/system_log/list/list.vue"
        )
    }
  ]
};
