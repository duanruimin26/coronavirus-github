export default ({ http }) => ({
  // 保存分析配置
  saveAnalysis(data){
    return http.post("/analysis/bindSampleSque", data);
  },
  // 数据解析列表查询
  getList(data){
    return http.post("/analysis/querySeqInfoList", data);
  },
  // 删除数据分析
  deleteAnalysis(data){
    return http.post("/analysis/deleteDataDirInfo", data);
  },
  // 作废数据分析
  cancelAnalysis(data){
    return http.get("/analysis/cancelDataDir", data);
  },
  // 分析上传模板下载
  downloadTemplate(){
    window.$app.postForm("/analysis/downloadUploadFile", {});
  },
  // 批量分析上传
  upload(config) {
    return http.upload("/analysis/upLoad", config);
  },
  // 获取数据解析详情列表
  getDataCatalogDetail(data){
    return http.post("/analysis/queryDataDirList", data);
  },
  // 执行分析操作
  doAnalysis(data){
    return http.post("/analysis/analysisSample", data);
  },
  // 点击全部信息按钮
  getAllInfo(data){
    return http.post("/analysis/queryDataDirResultDetail", data);
  },
  // 更新审核结果
  updateResultJudge(data){
    return http.post("/analysis/updateResultBySampleId", data);
  },
  // 导出目录下的样本信息
  exportByDataDir(data){
    window.$app.postForm("/analysis/exportByDataDir",data);
  },
  // 导出样本信息结果
  exportBySampleNum(data){
    window.$app.postForm("/analysis/exportBySampleNum",data);
  },
  //样本质控结果查询
  getDetailPcAndNc(data){
    return http.post("/analysis/queryDetailPCAndNC", data);
  }
});
