export default ({
  http
}) => ({
  // 检索下载列表查询
  getList(data) {
    return http.post("/report/queryReportDataDirList", data);
  },
  // 导出目录下的报告信息
  batchdownLoadReport(data){
    window.$app.postForm("/report/batchdownLoadReport",data);
  },
  // 检索下载详情列表查询
  getDataCatalogDetail(data){
    return http.post("/report/queryReportList", data);
  },
  // 导出目录详情下的报告信息
  exportByFileName(data){
    window.$app.postForm("/report/downloadUploadFile",data);
  },
  // 批量导出目录详情下的报告信息
  batchExportByFileName(data){
    window.$app.postForm("/report/selectDownloadUploadFile",data);
  },
  // 下载记录查询
  getRecordsInfo(data){
    return http.post("/report/downReportRecordList", data);
  }
});