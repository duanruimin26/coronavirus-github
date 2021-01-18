export default ({ http }) => ({
  // 登录
  login(data) {
    return http.post("/doLogin", data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      }
    });
  },
  // 登出
  logout(data = {}) {
    return http.post("/doLogout", data);
  },
  // 用户角色
  postRole(data = {}) {
    return http.post("/user/getRole", data);
  },
  // 获取权限菜单
  getMenu(data) {
    return http.post("/user/initMenu", data);
  },
  // 获取logo
  getLogo(data) {
    return http.post("/index/getSysPic", data,{
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      }
    });
  },
  //更新原密码
  updatePassword(data) {
    return http.post("/user/modifyPassword", data);
  },
  //校验按钮权限
  checkBtnAuth(data){
    return http.get("/checkAuth", data);
  }
});
