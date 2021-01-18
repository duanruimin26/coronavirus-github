import { prefix } from "@/meta_json";

export default {
  // 3.分析
  path: "analysis",
  name: "analysis",
  redirect: `${prefix}/analysis/dataAnalysis`,
  component: () =>
    import(
      /* webpackChunkName: "analysis/index" */ "@/views/analysis/index.vue"
    ),
  children: [
    {
      path: "dataAnalysis",
      name: "analysis.dataAnalysis",
      meta: { title: '数据解析' },
      component: () =>
        import(
          /* webpackChunkName: "analysis/data_analysis" */ "@/views/analysis/data_analysis/index.vue"
        )
    },
    {
      path: "dataAnalysisDetail",
      name: "analysis.dataAnalysis.dataAnalysisDetail",
      meta: { title: '数据解析详情' },
      component: () =>
        import(
          /* webpackChunkName: "analysis/data_analysis_detail" */ "@/views/analysis/data_analysis/dataAnalysisDetail.vue"
        )
    },
    {
      path: "addAnalysis",
      name: "analysis.dataAnalysis.addAnalysis",
      meta: { title: '分析配置' },
      component: () =>
        import(
          /* webpackChunkName: "analysis/data_analysis_add" */ "@/views/analysis/data_analysis/addAnalysis.vue"
        )
    },
    {
      path: "resultsReview",
      name: "analysis.resultsReview",
      meta: { title: '结果审核' },
      component: () =>
        import(
          /* webpackChunkName: "analysis/results_review" */ "@/views/analysis/results_review/index.vue"
        )
    },
    {
      path: "resultsReviewDetail",
      name: "analysis.resultsReview.resultsReviewDetail",
      meta: { title: '结果审核详情' },
      component: () =>
        import(
          /* webpackChunkName: "analysis/results_review_detail" */ "@/views/analysis/results_review/resultsReviewDetail.vue"
        )
    }
  ]
};
