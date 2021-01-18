export default ({ http }) => ({
  // 受检者信息列表查询
  getList(data) {
    return http.post("/sample/queryCheeckedInfoList", data);
  }
});
