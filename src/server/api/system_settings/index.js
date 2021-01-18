import systemParam from "./system_param";
import roleManage from "./role_manage";
import userManage from "./user_manage";

export default options => ({
  systemParam: systemParam(options),
  roleManage: roleManage(options),
  userManage: userManage(options)
});
