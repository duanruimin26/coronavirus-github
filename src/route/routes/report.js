import { prefix } from "@/meta_json";

export default {
  // 4.报告
  path: "report",
  name: "report",
  redirect: `${prefix}/report/searchDownload`,
  component: () =>
    import(
      /* webpackChunkName: "report/index" */ "@/views/report/index.vue"
    ),
  children: [
    {
      path: "searchDownload",
      name: "report.searchDownload",
      meta: { title: '检索下载' },
      component: () =>
        import(
          /* webpackChunkName: "report/search_download" */ "@/views/report/search_download/index.vue"
        )
    },
    {
      path: "searchDownloadDetail",
      name: "report.searchDownload.searchDownloadDetail",
      meta: { title: '检索下载详情' },
      component: () =>
        import(
          /* webpackChunkName: "report/search_download_detail" */ "@/views/report/search_download/searchDownloadDetail.vue"
        )
    }
  ]
};
