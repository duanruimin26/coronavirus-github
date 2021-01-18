export default ({ http }) => ({
  // 样本信息列表查询
  getList(data) {
    return http.post("/sample/querySampleInfoList", data);
  },
  // 删除样本信息
  deleteSample(data){
    return http.post("/sample/deleteSampleInfo", data);
  },
  // 样本上传模板下载
  downloadTemplate(){
    window.$app.postForm("/sample/downloadUploadFile", {});
  },
  // 样本文件上传
  upload(config) {
    return http.upload("/sample/upLoad", config);
  },
  // 检查样本编码是否存在
  cheeckSampleNum(data){
    return http.post("/sample/cheeckSampleNum", data);
  },
  // 新增样本信息详情
  saveSampleDetail(data){
    return http.post("/sample/saveSampleInfo", data);
  },
  // 编辑样本信息详情
  editSampleDetail(data){
    return http.post("/sample/updateSampleInfo", data);
  },
  // 显示字段设置查询
  viewColumn(data){
    return http.post("/sample/getFieldInfoByUserAndPageCode", data);
  },
  // 显示字段设置保存
  saveColumn(data){
    return http.post("/sample/updateFieldInfoByUserAndPageCode", data);
  },
});
