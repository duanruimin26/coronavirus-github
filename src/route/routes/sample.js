import { prefix } from "@/meta_json";

export default {
  // 2.样本
  path: "sample",
  name: "sample",
  redirect: `${prefix}/sample/subjectInfo`,
  component: () =>
    import(
      /* webpackChunkName: "sample/index" */ "@/views/sample/index.vue"
    ),
  children: [
    {
      path: "subjectInfo",
      name: "sample.subjectInfo",
      meta: { title: '受检者信息' },
      component: () =>
        import(
          /* webpackChunkName: "sample/subject_info" */ "@/views/sample/subject_info/index.vue"
        )
    },
    {
      path: "sampleInfo",
      name: "sample.sampleInfo",
      meta: { title: '样本信息' },
      component: () =>
        import(
          /* webpackChunkName: "sample/sample_info" */ "@/views/sample/sample_info/index.vue"
        )
    },
    {
      path: "edit",
      name: "sample.sampleInfo.edit",
      meta: { title: '添加样本' },
      beforeEnter(to,from,next){
    		if (to.query.sampId) {
          to.meta.title="编辑样本";
        }else{
          to.meta.title="添加样本";
        }
    		next();//加载模板
    		//不执行第三个参数的话，就不会加载模板了
   		},
      component: () =>
        import(
          /* webpackChunkName: "sample/sample_info_edit" */ "@/views/sample/sample_info/edit.vue"
        )
    }
  ]
};
