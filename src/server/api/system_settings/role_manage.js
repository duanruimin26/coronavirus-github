export default ({ http }) => ({
  // 列表查询
  getList(data) {
    return http.post("/role/getAllRolesByPage", data);
  },
  //新增角色
  addRole(params){
    return http.post("/role/addRole", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      }
    })
  },
  //编辑角色
  editRole(params){
    return http.post("/role/editRole", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      }
    })
  },
  //删除角色
  deleteRole(params){
    return http.get("/role/deleteRole", params)
  },
  //禁用/启用
  toggleRole(params){
    return http.post("/role/updateRoleEnableStatus", params)
  },
  //获取角色菜单
  getRoleMenuList(data){
    return http.get("/role/getMenuTreeByRoleId", data)
  },
  //保存角色菜单
  saveRoleMenu(data){
    return http.post("/role/saveMenuRole", data)
  }
});