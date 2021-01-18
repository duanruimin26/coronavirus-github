export default ({ http }) => ({
  // 列表查询
  getList(data) {
    return http.post("/user/getPagedUserInfoList", data);
  },
  //新增用户
  addUser(params){
    return http.post("/user/addUser", params)
  },
  //编辑用户
  editUser(params){
    return http.post("/user/updateUser", params)
  },
  //删除用户
  deleteUser(params){
    return http.get("/user/deleteUser", params)
  },
  //重置密码
  resetPassword(params){
    return http.get("/user/resetPassword", params)
  },
  //禁用/启用
  toggleUser(params){
    return http.get("/user/updateEnableStatus", params)
  },
  //获取角色下拉框
  getRoleList(){
    return http.get("/role/getAllRoles")
  },
  //获取部门下拉框
  getDeptList(){
    return http.get("/user/getAllDept")
  }

});
