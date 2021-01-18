export default ({ http }) => ({
  // 列表查询
  getList(data) {
    return http.post("/logs/getLogsInfoList", data);
  }
});
