<template>
  <div>
    <!-- 添加用户和编辑用户 -->
    <el-dialog
      :title="options.type == 'add' ? '添加用户' : '编辑用户'"
      :visible.sync="options.visible"
      width="520px"
      :before-close="beforeClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="10vh"
      class="edit-user"
    >
      <div class="dialog-content">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="80px"
          class="demo-ruleForm"
        >
          <el-form-item label="账号" prop="userName">
            <el-input
              :disabled="options.type == 'edit'"
              v-model="ruleForm.userName"
              placeholder="请输入账号"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户名称" prop="userNameDesc">
            <el-input
              v-model="ruleForm.userNameDesc"
              placeholder="请输入用户名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系手机" prop="telNo">
            <el-input
              v-model="ruleForm.telNo"
              placeholder="请输入联系手机"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系邮箱" prop="email">
            <el-input
              v-model="ruleForm.email"
              placeholder="请输入联系邮箱"
            ></el-input>
          </el-form-item>
          <el-form-item label="科室/部门" prop="deptName">
            <el-select v-model="ruleForm.deptName" placeholder="--" filterable allow-create default-first-option>
              <el-option
                v-for="item in deptList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色" prop="roleId">
            <el-select v-model="ruleForm.roleId" placeholder="--">
              <el-option
                v-for="item in roleList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="form-btns">
            <el-button type="primary" @click="beforeClose">取消</el-button>
            <el-button @click="submit">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <!-- 提示框 -->
    <c-tip-model :options="tipModel"></c-tip-model>
  </div>
</template>

<style lang="less">
.edit-user {
  .el-dialog__title {
    font-weight: bold;
  }
  .el-dialog__body {
    padding: 20px 40px 20px 20px;
  }

  .el-input__suffix {
    top: 2px !important;
  }

  .form-btns{
    .el-form-item__content{
      margin-left: 0 !important;
      text-align: center;
    }
  }
}
</style>

<script>
const { messageTips } = window.$app;
import { cTipModel } from "@/components";

export default {
  name: "userEdit",
  components: {
    cTipModel
  },
  props: {
    options: Object
  },
  data() {
    const validateUserName = (rule, value, callback) => {
      let pwdRegex = /^[A-Za-z][A-Za-z0-9]{4,}$/;
      if (value === "") {
        callback(new Error("账号不能为空!"));
      }else if (!pwdRegex.test(value)) {
        callback(new Error("账号由数字和字母组成，且以字母开头，长度至少为5!"));
      } else {
        callback();
      }
    }
    const validateTelNo = (rule, value, callback) => {
      let telNoRegex = /^1[3-9]\d{9}$/;
      if (value && (!telNoRegex.test(value))) {
        callback(new Error("手机号码格式错误!"));
      } else {
        callback();
      }
    }
    const validateEmail = (rule, value, callback) => {
      let emailRegex = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
      if (value && (!emailRegex.test(value))) {
        callback(new Error("邮箱格式错误!"));
      } else {
        callback();
      }
    }
    const validateDeptName = (rule, value, callback) => {
      if (value === "" || value.indexOf(" ")>-1) {
        callback(new Error("科室/部门不能为空！"));
      }else {
        callback();
      }
    }
    return {
      submitDisable: false, //提交按钮
      tipModel: {
        visible: false,
        cancelShow: false
      },
      ruleForm: {
        userName: "",
        userNameDesc: "",
        telNo: "",
        email: "",
        deptName: "",
        roleId: ""
      },
      rules: {
        userName: [
          { required: true, validator: validateUserName, trigger: "blur" }
        ],
        userNameDesc: [
          { required: true, message: "用户名称不能为空！", trigger: "blur" }
        ],
        telNo: [
          { validator: validateTelNo, trigger: "blur" }
        ],
        email: [
          { validator: validateEmail, trigger: "blur" }
        ],
        deptName: [
          { required: true, validator: validateDeptName, trigger: "blur" }
        ],
        roleId: [
          { required: true, message: "角色不能为空！", trigger: "blur" }
        ]
      },
      roleList: [],
      deptList: []
    };
  },
  methods: {
    beforeClose() {
      this.options.visible = false;
    },
    //获取用户角色下拉框数据
    getRoleList() {
      this.api.getRoleList().then(res => {
        const list = res.roleList || [];
        this.roleList = list.map(item => {
          return {
            label: item.roleName,
            value: item.roleId
          };
        });
      });
    },
    //获取部门下拉框数据
    getDeptList() {
      this.api.getDeptList().then(res => {
        const list = res.deptList || [];
        this.deptList = list.map(item => {
          return {
            label: item.deptName,
            value: item.deptName
          };
        });
      });
    },
    tipConfirm() {
      this.tipModel.visible = false;
    },
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.submitDisable) {
            return;
          }
          this.submitDisable = true;

          if (this.options.type == "edit") {
            this.api
              .editUser({
                userId: this.options.currentRow.userId,
                ...this.ruleForm
              })
              .then(res => {
                if (res.resCode == "200") {
                  this.options.visible = false;

                  const content = `<div>${"账号：<xmp class='red b'>{name}</xmp>".replace(
                    "{name}",
                    this.ruleForm.userName
                  )}</div><div>${"用户名称："}<xmp class='red b'>${
                    this.ruleForm.userNameDesc
                  }</xmp>`;
                  Object.assign(this.tipModel, {
                    visible: true,
                    cancelShow: false,
                    type: "success",
                    title: "修改用户成功！",
                    content
                  });

                  this.$parent.getList();
                } else {
                  messageTips("error", res.resMsg);
                }
                this.submitDisable = false;
              })
              .catch(() => {
                this.submitDisable = false;
              });
          } else {
            this.api
              .addUser({...this.ruleForm})
              .then(res => {
                if (res.resCode == "200") {
                  this.options.visible = false;

                  const content = `<div>${"账号：<xmp class='red b'>{name}</xmp>".replace(
                    "{name}",
                    this.ruleForm.userName
                  )}</div><div>${"初始密码为："}<xmp class='red b'>${
                    res.initialPassword
                  }</xmp></div>`;
                  Object.assign(this.tipModel, {
                    visible: true,
                    cancelShow: false,
                    type: "success",
                    title: "新增用户成功！",
                    content
                  });

                  this.$parent.getList();
                } else {
                  messageTips("error", res.resMsg);
                }
                this.submitDisable = false;
              })
              .catch(() => {
                this.submitDisable = false;
              });
          }
        } else {
          return false;
        }
      });
    }
  },
  watch: {
    "options.visible"(val) {
      if (!val) {
        this.$refs.ruleForm.resetFields();
        this.ruleForm = {};
        this.roleList = [];
        return;
      }

      if (this.options.type == "edit") {
        this.ruleForm = { ...this.options.currentRow };
      }

      this.getRoleList();
      this.getDeptList();
    }
  },
  mounted() {
    this.api = this.$api.systemSettings.userManage;
    // 提示框
    this.tipModel.confirm = this.tipConfirm;
  }
};
</script>
