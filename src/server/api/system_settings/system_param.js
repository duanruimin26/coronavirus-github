export default ({ http }) => ({
  // 获取首页系统参数
  getIndexSystemParam(data) {
    return http.post("/index/queryIndexInfo",data);
  },
  // 获取系统参数
  getSystemParam(data) {
    return http.post("/index/queryParamInfo",data);
  },
  // 获取服务器状态
  getServerStatus() {
    return http.get("/index/checkService");
  },
  //保存系统参数
  saveSystemParam(data) {
    return http.upload("index/upLoad", data);
  }
});
